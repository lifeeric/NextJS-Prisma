"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/Input";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmitHandler = async (data) => {
    const formData = new FormData();
    formData.append("vendorName", data.VendorName);
    formData.append("Date", data.Date);
    formData.append("csvFile", data.File[0]);

    setIsLoading(true);
    try {
      const r = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (!r.ok) {
        const errorResponse = await r.json();
        const error = await errorResponse.error

        throw new Error(error);
      }
      alert("Orders submitted Successfully");
    } catch (e) {
      alert(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        <h1 className="text-center">Bulk Order Submit</h1>
        <form
          className="mt-10"
          onSubmit={handleSubmit((data) => onFormSubmitHandler(data))}
        >
          <Input
            title="Vendor Name"
            type="text"
            register={register("VendorName", { required: true })}
          />
          {errors.VendorName && <p>Vendor name is required.</p>}
          <Input
            title="Date"
            type="date"
            register={register("Date", {
              required: "Date is required",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
                message: "Invalid date format (YYYY-MM-DD)",
              },
            })}
          />
          {errors.Date && <p>Date is required.</p>}

          <Input
            title="Order File"
            type="file"
            accept=".csv"
            register={register("File", {
              register: true,
              validate: {
                fileType: (value) => {
                  if (value[0]?.type !== "text/csv") {
                    return "Invalid file type. Only CSV files are allowed.";
                  }
                  return true;
                },
              },
            })}
          />
          {errors.File && <p>File is required.</p>}

          <button className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 w-full">
            {isLoading ? "Loading..." : "Submit Now"}
          </button>
        </form>
      </div>
    </main>
  );
}
