import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="grid grid-cols-5 grid-rows-9 mt-20 mx-20 gap-6">
      <Card className="col-span-2 row-span-4">
        <CardHeader className="text-center">
          <CardTitle>Name</CardTitle>
          <CardDescription>email@email.com</CardDescription>
        </CardHeader>
      </Card>
      <Card className="col-span-3 row-span-4">
        <CardHeader>
          <CardTitle>Bio</CardTitle>
          <CardDescription>Details</CardDescription>
        </CardHeader>
      </Card>
      <Card className="col-span-5 row-span-auto">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Past payment activities</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
