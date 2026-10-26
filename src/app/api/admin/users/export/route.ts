import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";
import { UI } from "@/constants/ui";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      userIds?: string[];
    };

    await connectDb();

    const filter =
      Array.isArray(body?.userIds) && body.userIds.length > 0
        ? { _id: { $in: body.userIds } }
        : {};

    const users = await UserModel.find(filter)
      .select("-passwordHash -passwordResetTokenHash")
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate user order statistics (orders count & total spend on completed/refunded orders)
    const userIds = users.map((u) => u._id);
    const orderStats = await OrderModel.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          paymentStatus: { $in: [PaymentStatus.PAID, PaymentStatus.REFUNDED] },
        },
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          totalSpend: { $sum: "$pricing.total" },
        },
      },
    ]);

    const statsMap = new Map<string, { orderCount: number; totalSpend: number }>();
    orderStats.forEach((stat) => {
      statsMap.set(String(stat._id), {
        orderCount: stat.orderCount || 0,
        totalSpend: Number(stat.totalSpend) || 0,
      });
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = UI.brand;
    workbook.lastModifiedBy = UI.brand;
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet("Users", {
      views: [{ showGridLines: true }],
      pageSetup: {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });

    // Embed company logo
    const logoPath = path.join(process.cwd(), "public", "logo.jpeg");
    if (fs.existsSync(logoPath)) {
      const base64Logo = fs.readFileSync(logoPath).toString("base64");
      const logoId = workbook.addImage({
        base64: base64Logo,
        extension: "jpeg",
      });
      worksheet.addImage(logoId, {
        tl: { col: 0.1, row: 0.2 },
        ext: { width: 72, height: 72 },
        editAs: "undefined",
      });
    }

    // Header Title Block
    worksheet.mergeCells("C1:O1");
    const titleCell = worksheet.getCell("C1");
    titleCell.value = `${UI.brand.toUpperCase()} — MARA CHEKKU COLD PRESSED OILS`;
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF8B1515" } };

    worksheet.mergeCells("C2:O2");
    const subTitleCell = worksheet.getCell("C2");
    subTitleCell.value = "Traditional Wood-Pressed Edible Oils & Ghee · Madurai, Tamil Nadu";
    subTitleCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF555555" } };

    worksheet.mergeCells("C3:O3");
    const addressCell = worksheet.getCell("C3");
    addressCell.value = `${UI.address} | Phone: ${UI.phoneDisplay} | Email: ${UI.email}`;
    addressCell.font = { name: "Calibri", size: 9, color: { argb: "FF666666" } };

    const nowFormatted = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const adminCount = users.filter((u) => u.role === "admin").length;
    const customerCount = users.length - adminCount;
    const cumulativeSpend = Array.from(statsMap.values()).reduce((sum: number, s) => sum + s.totalSpend, 0);

    worksheet.mergeCells("C4:O4");
    const metaCell = worksheet.getCell("C4");
    metaCell.value = `Users & Customers Export Report | Export Date: ${nowFormatted} | Total Users: ${users.length} (Admins: ${adminCount}, Customers: ${customerCount}) | Total Customer Spend: ₹${cumulativeSpend.toLocaleString("en-IN")}`;
    metaCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF1F2937" } };

    // Row heights for header
    worksheet.getRow(1).height = 24;
    worksheet.getRow(2).height = 18;
    worksheet.getRow(3).height = 18;
    worksheet.getRow(4).height = 20;
    worksheet.getRow(5).height = 10; // spacer row

    // Table Column Definitions
    const columns = [
      { header: "S.No", key: "sno", width: 7 },
      { header: "User ID", key: "userId", width: 26 },
      { header: "Full Name", key: "name", width: 24 },
      { header: "Email Address", key: "email", width: 28 },
      { header: "Phone Number", key: "phone", width: 16 },
      { header: "Role", key: "role", width: 14 },
      { header: "Registered On", key: "registeredAt", width: 18 },
      { header: "Completed Orders", key: "ordersCount", width: 18 },
      { header: "Total Spend (₹)", key: "totalSpend", width: 18 },
      { header: "Saved Addresses", key: "savedAddresses", width: 16 },
      { header: "Primary Address", key: "address", width: 38 },
      { header: "City", key: "city", width: 16 },
      { header: "State", key: "state", width: 16 },
      { header: "PIN Code", key: "pincode", width: 12 },
      { header: "Country", key: "country", width: 12 },
    ];

    const tableHeaderRowIndex = 6;
    const headerRow = worksheet.getRow(tableHeaderRowIndex);
    headerRow.height = 28;

    columns.forEach((col, idx) => {
      worksheet.getColumn(idx + 1).width = col.width;
      const cell = headerRow.getCell(idx + 1);
      cell.value = col.header;
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF8B1515" }, // Deep Crimson brand color
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: ["sno", "role", "ordersCount", "savedAddresses", "pincode", "country"].includes(col.key)
          ? "center"
          : col.key === "totalSpend"
            ? "right"
            : "left",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF5C0E0E" } },
        bottom: { style: "medium", color: { argb: "FF3B0A0A" } },
        left: { style: "thin", color: { argb: "FF5C0E0E" } },
        right: { style: "thin", color: { argb: "FF5C0E0E" } },
      };
    });

    // Populate data rows
    let currentRowIndex = tableHeaderRowIndex + 1;

    users.forEach((user, index) => {
      const dataRow = worksheet.getRow(currentRowIndex);
      const isEven = index % 2 === 0;
      const rowBgColor = isEven ? "FFFFFFFF" : "FFFDFBF7";

      const registeredDate = user.createdAt
        ? new Date(user.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—";

      const stats = statsMap.get(String(user._id)) || { orderCount: 0, totalSpend: 0 };

      // Find primary or default address
      const addresses = Array.isArray(user.addresses) ? user.addresses : [];
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

      const addressLine = defaultAddr
        ? [defaultAddr.line1, defaultAddr.line2].filter(Boolean).join(", ")
        : "—";

      const rowValues = [
        index + 1,
        String(user._id),
        user.name || "—",
        user.email || "—",
        user.phone || defaultAddr?.phone || "—",
        user.role === "admin" ? "Admin" : "Customer",
        registeredDate,
        stats.orderCount,
        stats.totalSpend,
        addresses.length,
        addressLine,
        defaultAddr?.city || "—",
        defaultAddr?.state || "—",
        defaultAddr?.pincode || "—",
        defaultAddr?.country || "India",
      ];

      rowValues.forEach((val, colIdx) => {
        const cell = dataRow.getCell(colIdx + 1);
        cell.value = val;
        cell.font = { name: "Calibri", size: 10, color: { argb: "FF1F2937" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowBgColor },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };

        const colKey = columns[colIdx].key;
        if (colKey === "totalSpend") {
          cell.numFmt = "₹#,##0.00";
          cell.alignment = { vertical: "middle", horizontal: "right" };
          cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF111827" } };
        } else if (["sno", "role", "ordersCount", "savedAddresses", "pincode", "country"].includes(colKey)) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        } else {
          cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
        }
      });

      dataRow.height = 24;
      currentRowIndex++;
    });

    // Summary Row
    if (users.length > 0) {
      const summaryRow = worksheet.getRow(currentRowIndex);
      summaryRow.height = 26;

      worksheet.mergeCells(`A${currentRowIndex}:H${currentRowIndex}`);
      const summaryLabelCell = summaryRow.getCell(1);
      summaryLabelCell.value = `TOTAL (${users.length} Users)`;
      summaryLabelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      summaryLabelCell.alignment = { vertical: "middle", horizontal: "right" };

      for (let c = 1; c <= 8; c++) {
        const cCell = summaryRow.getCell(c);
        cCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
        cCell.border = {
          top: { style: "medium", color: { argb: "FFD97706" } },
          bottom: { style: "double", color: { argb: "FF92400E" } },
        };
      }

      // Total spend cell
      const spendCell = summaryRow.getCell(9);
      spendCell.value = cumulativeSpend;
      spendCell.numFmt = "₹#,##0.00";
      spendCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      spendCell.alignment = { vertical: "middle", horizontal: "right" };
      spendCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      spendCell.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Clear remaining cells in summary row
      for (let c = 10; c <= columns.length; c++) {
        const cell = summaryRow.getCell(c);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
        cell.border = {
          top: { style: "medium", color: { argb: "FFD97706" } },
          bottom: { style: "double", color: { argb: "FF92400E" } },
        };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const dateStamp = new Date().toISOString().split("T")[0];
    const filename = `VS_OilMill_Users_${dateStamp}.xlsx`;

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Users export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export users" },
      { status: 500 },
    );
  }
}
