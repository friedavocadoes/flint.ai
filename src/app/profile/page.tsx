"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserInfo } from "@/hooks/useUserInfo";
import PaymentTable, { PaymentTableLoader } from "@/components/paymentTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { userInfo, loading } = useUserInfo();
  console.log(userInfo);
  const bioData = [
    { name: "Role", data: userInfo?.role },
    { name: "Nationality", data: userInfo?.nationality },
    { name: "Age", data: userInfo?.age },
    { name: "Gender", data: userInfo?.sex },
  ];
  return (
    <>
      {loading ? (
        <ProfileLoader />
      ) : (
        <div className="grid md:grid-cols-5 md:grid-rows-auto mt-20 md:mt-30 mb-20 mx-4 md:mx-20 gap-6">
          {/* Name and avatar */}
          <Card className="md:col-span-2 md:row-span-2 flex flex-col h-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {userInfo?.name}
              </CardTitle>
              <CardDescription className="font-semibold">
                {userInfo?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="mx-auto flex-1">
              <div className="h-78 w-78 rounded-full bg-slate-400"></div>
            </CardContent>
            <CardFooter className="flex flex-col justify-end text-center text-xs text-stone-400">
              {userInfo?.createdAt && (
                <>
                  <span className="font-semibold">Account created on </span>
                  {formatFancyDate(userInfo.createdAt)}
                </>
              )}
            </CardFooter>
          </Card>

          {/* Bio and details */}
          <Card className="md:col-span-3 md:row-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Bio</CardTitle>
              <CardDescription>Details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 grid-rows-2 gap-5 text-md mt-1 ml-4">
              {bioData?.map((bio) => (
                <div className="flex flex-col" key={bio.name}>
                  <span className="font-semibold text-xs text-stone-500">
                    {bio.name}{" "}
                  </span>
                  {bio.data}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Premium and billing */}
          <Card className="md:col-span-3 md:row-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Premium & Billing</CardTitle>
              <CardDescription>Details</CardDescription>
            </CardHeader>
          </Card>

          {/* Payment history */}
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle className="text-xl">Payment History</CardTitle>
              <CardDescription>Past payment activities</CardDescription>
            </CardHeader>
            <CardContent>
              {userInfo?.payments && (
                <PaymentTable payments={userInfo.payments} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export function ProfileLoader() {
  return (
    <div className="grid md:grid-cols-5 md:grid-rows-9 mt-20 md:mt-30 mx-20 gap-6">
      <Card className="md:col-span-2 md:row-span-2 flex flex-col h-full">
        <CardHeader className="text-center ">
          <CardTitle className="mx-auto">
            <Skeleton className="h-8 w-60" />
          </CardTitle>
          <CardDescription className="font-semibold mx-auto">
            <Skeleton className="h-5 w-30" />
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-auto flex-1 flex items-center justify-center ">
          <Skeleton className="w-78 h-78 rounded-full" />
        </CardContent>
        {/* footer on the bottom */}
        <CardFooter className=" flex flex-col justify-end text-center text-xs text-stone-400">
          <Skeleton className="w-40 h-4" />
          <Skeleton className="w-50 h-4 mt-2" />
        </CardFooter>
      </Card>

      {/* bio */}
      <Card className="md:col-span-3 md:row-span-1">
        <CardHeader>
          <CardTitle className="text-xl">Bio</CardTitle>
          <CardDescription>Details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 grid-rows-2 gap-6 text-md mt-1 ml-4">
          {[1, 2, 3, 4].map((bio) => (
            <div className="flex flex-col" key={bio}>
              <span className="font-semibold text-xs text-stone-500 mb-2">
                <Skeleton className="w-15 h-4" />
              </span>
              <Skeleton className="w-40 h-6" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Premium and billing */}
      <Card className="md:col-span-3 md:row-span-1">
        <CardHeader>
          <CardTitle className="text-xl">Premium & Billing</CardTitle>
          <CardDescription>Details</CardDescription>
        </CardHeader>
      </Card>

      {/* Payment history */}
      <Card className="md:col-span-5">
        <CardHeader>
          <CardTitle className="text-xl">Payment History</CardTitle>
          <CardDescription>Past payment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentTableLoader />
        </CardContent>
      </Card>
    </div>
  );
}

function formatFancyDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("default", { weekday: "short" });
  return `${day}${daySuffix} of ${month} (${weekday}) on ${year}`;
}
