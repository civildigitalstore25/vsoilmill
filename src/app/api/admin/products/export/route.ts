import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { ProductModel } from "@/models/Product";
import { CategoryModel } from "@/models/Category";
import { UI } from "@/constants/ui";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      productIds?: string[];
    };

    await connectDb();
    void CategoryModel; // Ensure category model is registered for populate

    const filter =
      Array.isArray(body?.productIds) && body.productIds.length > 0
        ? { _id: { $in: body.productIds } }
        : {};

    const products = await ProductModel.find(filter)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = UI.brand;
    workbook.lastModifiedBy = UI.brand;
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet("Products", {
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
    worksheet.mergeCells("C1:T1");
    const titleCell = worksheet.getCell("C1");
    titleCell.value = `${UI.brand.toUpperCase()} — MARA CHEKKU COLD PRESSED OILS`;
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF8B1515" } };

    worksheet.mergeCells("C2:T2");
    const subTitleCell = worksheet.getCell("C2");
    subTitleCell.value = "Traditional Wood-Pressed Edible Oils & Ghee · Madurai, Tamil Nadu";
    subTitleCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF555555" } };

    worksheet.mergeCells("C3:T3");
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

    const activeCount = products.filter((p) => p.isActive).length;
    const totalVariantsCount = products.reduce((acc: number, p) => acc + (p.variants?.length || 1), 0);
    const totalStockCount = products.reduce((acc: number, p) => {
      const vStock = (p.variants || []).reduce((sum: number, v: { stock?: number }) => sum + (Number(v.stock) || 0), 0);
      return acc + vStock;
    }, 0);

    worksheet.mergeCells("C4:T4");
    const metaCell = worksheet.getCell("C4");
    metaCell.value = `Products Catalog & Inventory Report | Export Date: ${nowFormatted} | Total Products: ${products.length} (Active: ${activeCount}) | Total Variants: ${totalVariantsCount} | Total Stock: ${totalStockCount} units`;
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
      { header: "Product ID", key: "productId", width: 26 },
      { header: "Product Name", key: "name", width: 28 },
      { header: "Category", key: "category", width: 18 },
      { header: "Variant / Size", key: "variant", width: 18 },
      { header: "SKU", key: "sku", width: 16 },
      { header: "Original Price (₹)", key: "originalPrice", width: 16 },
      { header: "Sale Price (₹)", key: "price", width: 15 },
      { header: "Offer Price (₹)", key: "offerPrice", width: 15 },
      { header: "Stock Qty", key: "stock", width: 12 },
      { header: "Availability", key: "availability", width: 15 },
      { header: "Weight (g)", key: "weight", width: 12 },
      { header: "Product Status", key: "status", width: 14 },
      { header: "Bestseller", key: "bestseller", width: 12 },
      { header: "New Arrival", key: "newArrival", width: 12 },
      { header: "GST Exempt", key: "gstExempt", width: 12 },
      { header: "Avg Rating", key: "rating", width: 12 },
      { header: "Reviews", key: "reviews", width: 10 },
      { header: "Slug", key: "slug", width: 24 },
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
        horizontal: [
          "sno",
          "sku",
          "stock",
          "availability",
          "weight",
          "status",
          "bestseller",
          "newArrival",
          "gstExempt",
          "rating",
          "reviews",
        ].includes(col.key)
          ? "center"
          : ["originalPrice", "price", "offerPrice"].includes(col.key)
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
    let serialNumber = 1;
    let sumTotalStock = 0;
    let sumSalePrices = 0;
    let countItems = 0;

    products.forEach((product, prodIdx) => {
      const categoryName =
        product.categoryId && typeof product.categoryId === "object" && "name" in product.categoryId
          ? (product.categoryId as { name?: string }).name || "—"
          : "—";

      const createdDate = product.createdAt
        ? new Date(product.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—";

      const variants = Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants
        : [
            {
              label: "Default",
              sku: "—",
              originalPrice: 0,
              price: 0,
              offerPrice: null,
              stock: 0,
              available: true,
              weightGrams: 0,
            },
          ];

      const isEvenProd = prodIdx % 2 === 0;
      const rowBgColor = isEvenProd ? "FFFFFFFF" : "FFFDFBF7";

      variants.forEach((v) => {
        const dataRow = worksheet.getRow(currentRowIndex);
        const originalPrice = Number(v.originalPrice) || 0;
        const salePrice = Number(v.price) || 0;
        const offerPrice = v.offerPrice != null ? Number(v.offerPrice) : null;
        const stockQty = Number(v.stock) || 0;

        sumTotalStock += stockQty;
        sumSalePrices += salePrice;
        countItems++;

        const isAvailable = v.available !== false && stockQty > 0;

        const rowValues = [
          serialNumber++,
          String(product._id),
          product.name,
          categoryName,
          v.label || "Default",
          v.sku || "—",
          originalPrice,
          salePrice,
          offerPrice != null ? offerPrice : "—",
          stockQty,
          isAvailable ? "In Stock" : "Out of Stock",
          v.weightGrams ? `${v.weightGrams}g` : "—",
          product.isActive ? "Active" : "Inactive",
          product.isBestSeller ? "Yes" : "No",
          product.isNewArrival ? "Yes" : "No",
          product.gstExempt ? "Yes" : "No",
          Number(product.averageRating || 0).toFixed(1),
          Number(product.reviewCount || 0),
          product.slug,
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
          if (["originalPrice", "price"].includes(colKey)) {
            cell.numFmt = "₹#,##0.00";
            cell.alignment = { vertical: "middle", horizontal: "right" };
            if (colKey === "price") {
              cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF111827" } };
            }
          } else if (colKey === "offerPrice") {
            if (typeof val === "number") {
              cell.numFmt = "₹#,##0.00";
              cell.alignment = { vertical: "middle", horizontal: "right" };
              cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF047857" } };
            } else {
              cell.alignment = { vertical: "middle", horizontal: "center" };
            }
          } else if (colKey === "stock") {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.font = { name: "Calibri", size: 10, bold: true };
          } else if (
            [
              "sno",
              "sku",
              "availability",
              "weight",
              "status",
              "bestseller",
              "newArrival",
              "gstExempt",
              "rating",
              "reviews",
            ].includes(colKey)
          ) {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          } else {
            cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
          }
        });

        dataRow.height = 24;
        currentRowIndex++;
      });
    });

    // Summary Row
    if (countItems > 0) {
      const summaryRow = worksheet.getRow(currentRowIndex);
      summaryRow.height = 26;

      worksheet.mergeCells(`A${currentRowIndex}:F${currentRowIndex}`);
      const summaryLabelCell = summaryRow.getCell(1);
      summaryLabelCell.value = `TOTAL (${products.length} Products, ${countItems} Variants)`;
      summaryLabelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      summaryLabelCell.alignment = { vertical: "middle", horizontal: "right" };

      for (let c = 1; c <= 6; c++) {
        const cCell = summaryRow.getCell(c);
        cCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
        cCell.border = {
          top: { style: "medium", color: { argb: "FFD97706" } },
          bottom: { style: "double", color: { argb: "FF92400E" } },
        };
      }

      // Column 7: Original Price (average or blank)
      const avgSalePrice = sumSalePrices / countItems;
      const c7 = summaryRow.getCell(7);
      c7.value = "Avg Price:";
      c7.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF78350F" } };
      c7.alignment = { vertical: "middle", horizontal: "right" };
      c7.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      c7.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Column 8: Average Sale Price
      const c8 = summaryRow.getCell(8);
      c8.value = avgSalePrice;
      c8.numFmt = "₹#,##0.00";
      c8.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      c8.alignment = { vertical: "middle", horizontal: "right" };
      c8.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      c8.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Column 9: Spacer
      const c9 = summaryRow.getCell(9);
      c9.value = "Total Stock:";
      c9.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF78350F" } };
      c9.alignment = { vertical: "middle", horizontal: "right" };
      c9.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      c9.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Column 10: Total Stock Count
      const c10 = summaryRow.getCell(10);
      c10.value = sumTotalStock;
      c10.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF78350F" } };
      c10.alignment = { vertical: "middle", horizontal: "center" };
      c10.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      c10.border = {
        top: { style: "medium", color: { argb: "FFD97706" } },
        bottom: { style: "double", color: { argb: "FF92400E" } },
      };

      // Clear remaining cells in summary row
      for (let c = 11; c <= columns.length; c++) {
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
    const filename = `VS_OilMill_Products_${dateStamp}.xlsx`;

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Products export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export products" },
      { status: 500 },
    );
  }
}
