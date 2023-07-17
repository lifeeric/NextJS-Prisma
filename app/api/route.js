import { NextResponse } from "next/server";
import csv from "csvtojson/";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const data = await request.formData();

  try {
    const vendorName = await data.get("vendorName");
    const date = new Date(await data.get("Date"));
    const rawFile = await data.get("csvFile").text();
    const csvToJson = await csv().fromString(rawFile);

    const isFloat = (num) => !Number.isInteger(num);

    for (let order of csvToJson) {
      const ModelNumber = order["Model Number"];
      const UnitPrice = +order["Unit Price"];
      const Quantity = +order["Quantity"];

      if (!typeof ModelNumber === "string" && order["Model Number"])
        throw new Error("Model Number Should be String and not null");
      if (!isFloat(UnitPrice) && order["Unit Price"])
        throw new Error("Unit Price Should be decimal and not null");
      if (isFloat(Quantity) && order["Quantity"])
        throw new Error("Quantity Should be Integer and not null");

      order["ModelNumber"] = order["Model Number"];
      order["UnitPrice"] = order["Unit Price"];

      order["UnitPrice"] = UnitPrice;
      order["Quantity"] = Quantity;

      delete order["Model Number"];
      delete order["Unit Price"];
    }


    const r = await prisma.user.create({
      data: {
        VendorName: vendorName,
        Date: date,
        orders: {
          create: csvToJson,
        },
      },
    });

      console.log(r)

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.log("[error X]", error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
