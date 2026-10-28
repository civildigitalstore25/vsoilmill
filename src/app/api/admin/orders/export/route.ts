import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";
import { UserModel } from "@/models/User";
import { PaymentStatus, type OrderItem } from "@/types/order";
import { ATTRIBUTION_COPY, ATTRIBUTION_EXPORT } from "@/constants/attribution";
import { formatSourceLabel } from "@/lib/attribution/labels";
import { UI } from "@/constants/ui";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      orderIds?: string[];
    };

    await connectDb();
    void UserModel;

    // Build filter: if orderIds are provided, export those specific filtered orders
    // Otherwise export all non-failed orders (successful payments)
    const filter =
      Array.isArray(body?.orderIds) && body.orderIds.length > 0
        ? { _id: { $in: body.orderIds } }
        : { paymentStatus: { $in: [PaymentStatus.PAID, PaymentStatus.REFUNDED] } };

    const orders = await OrderModel.find(filter)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = UI.brand;
    workbook.lastModifiedBy = UI.brand;
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet("Orders", {
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
    worksheet.mergeCells("C1:K1");
    const titleCell = worksheet.getCell("C1");
    titleCell.value = `${UI.brand.toUpperCase()} — MARA CHEKKU COLD PRESSED OILS`;
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF8B1515" } };

    worksheet.mergeCells("C2:K2");
    const subTitleCell = worksheet.getCell("C2");
    subTitleCell.value = "Traditional Wood-Pressed Edible Oils & Ghee · Madurai, Tamil Nadu";
    subTitleCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF555555" } };

    worksheet.mergeCells("C3:K3");
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

    const totalRevenueSum = orders.reduce(
      (sum, o) => sum + (Number(o.pricing?.total) || 0),
      0,
    );

    worksheet.mergeCells("C4:K4");
    const metaCell = worksheet.getCell("C4");
    metaCell.value = `Orders Export Report | Export Date: ${nowFormatted} | Total Orders: ${orders.length} | Total Value: ₹${totalRevenueSum.toLocaleString("en-IN")}`;
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
      { header: "Order ID", key: "orderId", width: 26 },
      { header: "Date & Time", key: "date", width: 18 },
      { header: "Customer Name", key: "customerName", width: 24 },
      { header: "Phone Number", key: "phone", width: 16 },
      { header: "Email", key: "email", width: 26 },
      { header: "Delivery Address", key: "address", width: 38 },
      { header: "City", key: "city", width: 16 },
      { header: "State", key: "state", width: 16 },
      { header: "PIN Code", key: "pincode", width: 12 },
      { header: "Items Ordered", key: "items", width: 40 },
      { header: "Total Qty", key: "totalQty", width: 11 },
      { header: "Subtotal (₹)", key: "subtotal", width: 15 },
      { header: "Shipping (₹)", key: "shipping", width: 14 },
      { header: "GST (₹)", key: "tax", width: 13 },
      { header: "Discount (₹)", key: "discount", width: 14 },
      { header: "Total Amount (₹)", key: "total", width: 18 },
      { header: "Order Status", key: "status", width: 16 },
      { header: "Payment Status", key: "paymentStatus", width: 16 },
      { header: "PhonePe Order ID", key: "merchantOrderId", width: 28 },
      { header: "Transaction ID", key: "transactionId", width: 28 },
      { header: ATTRIBUTION_EXPORT.source, key: "source", width: 16 },
      { header: ATTRIBUTION_EXPORT.medium, key: "medium", width: 14 },
      { header: ATTRIBUTION_EXPORT.campaign, key: "campaign", width: 22 },
      { header: ATTRIBUTION_EXPORT.content, key: "content", width: 16 },
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
        horizontal: ["sno", "pincode", "totalQty", "status", "paymentStatus"].includes(col.key)
          ? "center"
          : ["subtotal", "shipping", "tax", "discount", "total"].includes(col.key)
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

    orders.forEach((order, index) => {
      const dataRow = worksheet.getRow(currentRowIndex);
      const isEven = index % 2 === 0;
      const rowBgColor = isEven ? "FFFFFFFF" : "FFFDFBF7"; // warm subtle zebra striping

      const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const customerPhone = (
        order.shippingAddress?.phone ||
        (typeof order.userId === "object" && order.userId && "phone" in order.userId
          ? (order.userId as { phone?: string }).phone
          : "") ||
        ""
      ).trim();

      const customerEmail =
        order.shippingAddress?.email ||
        (typeof order.userId === "object" && order.userId && "email" in order.userId
          ? (order.userId as { email?: string }).email
          : "") ||
        "";

      const addressLine = [
        order.shippingAddress?.line1,
        order.shippingAddress?.line2,
      ]
        .filter(Boolean)
        .join(", ");

      const itemsSummary = (order.items || [])
        .map(
          (item: OrderItem) =>
            `${item.name} (${item.variantLabel}) × ${item.quantity} [₹${item.price * item.quantity}]`,
        )
        .join("\n");

      const totalItemQty = (order.items || []).reduce(
        (sum: number, item: OrderItem) => sum + (Number(item.quantity) || 0),
        0,
      );

      const subtotalVal = Number(order.pricing?.subtotal) || 0;
      const shippingVal = Number(order.pricing?.shipping) || 0;
      const taxVal = Number(order.pricing?.tax) || 0;
      const discountVal = Number(order.pricing?.discount) || 0;
      const totalVal = Number(order.pricing?.total) || 0;

      const rowValues = [
        index + 1,
        String(order._id),
        orderDate,
        order.shippingAddress?.fullName || "Customer",
        customerPhone || "—",
        customerEmail || "—",
        addressLine || "—",
        order.shippingAddress?.city || "—",
        order.shippingAddress?.state || "—",
        order.shippingAddress?.pincode || "—",
        itemsSummary,
        totalItemQty,
        subtotalVal,
        shippingVal,
        taxVal,
        discountVal,
        totalVal,
        order.status,
        order.paymentStatus,
        order.phonepeMerchantOrderId || "—",
        order.phonepeTransactionId || "—",
        formatSourceLabel(order.attribution?.source),
        order.attribution?.medium || ATTRIBUTION_COPY.empty,
        order.attribution?.campaign || ATTRIBUTION_COPY.empty,
        order.attribution?.content || ATTRIBUTION_COPY.empty,
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
        if (["subtotal", "shipping", "tax", "discount", "total"].includes(colKey)) {
          cell.numFmt = "₹#,##0.00";
          cell.alignment = { vertical: "middle", horizontal: "right" };
          if (colKey === "total") {
            cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF111827" } };
          }
        } else if (["sno", "pincode", "totalQty", "status", "paymentStatus"].includes(colKey)) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        } else {
          cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
        }
      });

      // Dynamic row height if multiple items
      const lineCount = (order.items || []).length;
      dataRow.height = Math.max(22, lineCount * 18);

      currentRowIndex++;
    });

    // Summary Row
    if (orders.length > 0) {
      const summaryRow = worksheet.getRow(currentRowIndex);
      summaryRow.height = 26;

      worksheet.mergeCells(`A${currentRowIndex}:L${currentRowIndex}`);
      const summaryLabelCell = summaryRow.getCell(1);
      summaryLabelCell.value = `TOTAL (${orders.length} Orders)`;
      summaryLabelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      summaryLabelCell.alignment = { vertical: "middle", horizontal: "right" };

      // Apply styling to merged area
      for (let c = 1; c <= 12; c++) {
        const cCell = summaryRow.getCell(c);
        cCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
        cCell.border = {
          top: { style: "medium", color: { argb: "FFD97706" } },
          bottom: { style: "double", color: { argb: "FF92400E" } },
        };
      }

      const sumCols = [
        { col: 13, val: orders.reduce((s, o) => s + (Number(o.pricing?.subtotal) || 0), 0) },
        { col: 14, val: orders.reduce((s, o) => s + (Number(o.pricing?.shipping) || 0), 0) },
        { col: 15, val: orders.reduce((s, o) => s + (Number(o.pricing?.tax) || 0), 0) },
        { col: 16, val: orders.reduce((s, o) => s + (Number(o.pricing?.discount) || 0), 0) },
        { col: 17, val: totalRevenueSum },
      ];

      sumCols.forEach(({ col, val }) => {
        const cell = summaryRow.getCell(col);
        cell.value = val;
        cell.numFmt = "₹#,##0.00";
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
        cell.alignment = { vertical: "middle", horizontal: "right" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
        cell.border = {
          top: { style: "medium", color: { argb: "FFD97706" } },
          bottom: { style: "double", color: { argb: "FF92400E" } },
        };
      });

      // Clear remaining cells in summary row
      for (let c = 18; c <= columns.length; c++) {
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
    const filename = `VS_OilMill_Orders_${dateStamp}.xlsx`;

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Order export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export orders" },
      { status: 500 },
    );
  }
}
