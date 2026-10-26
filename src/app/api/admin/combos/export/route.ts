import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { ComboModel } from "@/models/Combo";
import { UI } from "@/constants/ui";
import { stripHtml } from "@/lib/utils/format";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      comboIds?: string[];
    };

    await connectDb();

    const filter =
      Array.isArray(body?.comboIds) && body.comboIds.length > 0
        ? { _id: { $in: body.comboIds } }
        : {};

    const combos = await ComboModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = UI.brand;
    workbook.lastModifiedBy = UI.brand;
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet("Combo Offers", {
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

    const activeCount = combos.filter((c) => c.isActive).length;
    const totalOriginalSum = combos.reduce((sum: number, c) => sum + (Number(c.originalPrice) || 0), 0);
    const totalComboSum = combos.reduce((sum: number, c) => sum + (Number(c.price) || 0), 0);
    const totalSavingsSum = Math.max(0, totalOriginalSum - totalComboSum);

    worksheet.mergeCells("C4:O4");
    const metaCell = worksheet.getCell("C4");
    metaCell.value = `Combo Offers & Bundles Report | Export Date: ${nowFormatted} | Total Combos: ${combos.length} (Active: ${activeCount}) | Total Savings Offered: ₹${totalSavingsSum.toLocaleString("en-IN")}`;
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
      { header: "Combo ID", key: "comboId", width: 26 },
      { header: "Combo Name", key: "name", width: 28 },
      { header: "Status", key: "status", width: 14 },
      { header: "Original Price (₹)", key: "originalPrice", width: 18 },
      { header: "Combo Price (₹)", key: "price", width: 16 },
      { header: "Discount / Savings (₹)", key: "savings", width: 22 },
      { header: "Discount (%)", key: "discountPercent", width: 14 },
      { header: "Total Items", key: "itemCount", width: 12 },
      { header: "Included Products & Variants", key: "itemsSummary", width: 44 },
      { header: "Offer Starts", key: "startsAt", width: 18 },
      { header: "Offer Ends", key: "endsAt", width: 18 },
      { header: "Description", key: "description", width: 36 },
      { header: "Slug", key: "slug", width: 22 },
      { header: "Created Date", key: "createdAt", width: 18 },
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
        horizontal: ["sno", "status", "discountPercent", "itemCount", "startsAt", "endsAt", "createdAt"].includes(col.key)
          ? "center"
          : ["originalPrice", "price", "savings"].includes(col.key)
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

    combos.forEach((combo, index) => {
      const dataRow = worksheet.getRow(currentRowIndex);
      const isEven = index % 2 === 0;
      const rowBgColor = isEven ? "FFFFFFFF" : "FFFDFBF7";

      const createdDate = combo.createdAt
        ? new Date(combo.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—";

      const startDate = combo.startsAt
        ? new Date(combo.startsAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Always active";

      const endDate = combo.endsAt
        ? new Date(combo.endsAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "No expiry";

      const originalVal = Number(combo.originalPrice) || 0;
      const comboPriceVal = Number(combo.price) || 0;
      const savingsVal = Math.max(0, originalVal - comboPriceVal);
      const discountPct = originalVal > 0 ? `${Math.round((savingsVal / originalVal) * 100)}%` : "0%";

      const items = Array.isArray(combo.items) ? combo.items : [];
      const totalItemsQty = items.reduce((sum: number, it: { quantity?: number }) => sum + (Number(it.quantity) || 1), 0);

      const itemsSummary = items
        .map((it) => {
          const pName = it.productName || "Product";
          const vLabel = it.variantLabel ? ` (${it.variantLabel})` : "";
          const qty = it.quantity ? ` × ${it.quantity}` : "";
          return `${pName}${vLabel}${qty}`;
        })
        .join("\n");

      const cleanName = stripHtml(combo.name || "");
      const cleanDesc = stripHtml(combo.description || "");

      const rowValues = [
        index + 1,
        String(combo._id),
        cleanName,
        combo.isActive ? "Active" : "Inactive",
        originalVal,
        comboPriceVal,
        savingsVal,
        discountPct,
        totalItemsQty,
        itemsSummary || "—",
        startDate,
        endDate,
        cleanDesc || "—",
        combo.slug || "—",
        createdDate,
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
        if (["originalPrice", "price", "savings"].includes(colKey)) {
          cell.numFmt = "₹#,##0.00";
          cell.alignment = { vertical: "middle", horizontal: "right" };
          if (colKey === "price") {
            cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF111827" } };
          } else if (colKey === "savings") {
            cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF047857" } };
          }
        } else if (["sno", "status", "discountPercent", "itemCount", "startsAt", "endsAt", "createdAt"].includes(colKey)) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        } else {
          cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
        }
      });

      // Dynamic row height if multiple combo items
      const lineCount = Math.max(1, items.length);
      dataRow.height = Math.max(24, lineCount * 18);

      currentRowIndex++;
    });

    // Summary Row
    if (combos.length > 0) {
      const summaryRow = worksheet.getRow(currentRowIndex);
      summaryRow.height = 26;

      worksheet.mergeCells(`A${currentRowIndex}:D${currentRowIndex}`);
      const summaryLabelCell = summaryRow.getCell(1);
      summaryLabelCell.value = `TOTAL (${combos.length} Combos)`;
      summaryLabelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      summaryLabelCell.alignment = { vertical: "middle", horizontal: "right" };

      for (let c = 1; c <= 4; c++) {
        const cCell = summaryRow.getCell(c);
        cCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
        cCell.border = {
          top: { style: "medium", color: { argb: "FFD97706" } },
          bottom: { style: "double", color: { argb: "FF92400E" } },
        };
      }

      // Column 5: Original Price Sum
      const c5 = summaryRow.getCell(5);
      c5.value = totalOriginalSum;
      c5.numFmt = "₹#,##0.00";
      c5.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      c5.alignment = { vertical: "middle", horizontal: "right" };
      c5.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      c5.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Column 6: Combo Price Sum
      const c6 = summaryRow.getCell(6);
      c6.value = totalComboSum;
      c6.numFmt = "₹#,##0.00";
      c6.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      c6.alignment = { vertical: "middle", horizontal: "right" };
      c6.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      c6.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Column 7: Total Savings Sum
      const c7 = summaryRow.getCell(7);
      c7.value = totalSavingsSum;
      c7.numFmt = "₹#,##0.00";
      c7.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF047857" } };
      c7.alignment = { vertical: "middle", horizontal: "right" };
      c7.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      c7.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Clear remaining cells in summary row
      for (let c = 8; c <= columns.length; c++) {
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
    const filename = `VS_OilMill_Combos_${dateStamp}.xlsx`;

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Combos export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export combos" },
      { status: 500 },
    );
  }
}
