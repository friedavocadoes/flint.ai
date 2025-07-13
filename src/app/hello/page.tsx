"use client";
import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserInfo } from "@/hooks/useUserInfo";
import { ComboBox } from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import countries from "@/content/countries.json";
import roles from "@/content/roles.json";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Hello() {
  const { setMeInfo } = useUserInfo();
  const [nationality, setNationality] = useState("");
  const [role, setRole] = useState("");
  const [sex, setSex] = useState<"Male" | "Female" | "Other" | null>(null);
  const [age, setAge] = useState(0);
  const router = useRouter();

  const handleSubmit = () => {
    if (nationality === "" || role === "" || sex === null || age === 0) {
      toast.error("Make sure to fill all fields");
      return;
    }

    const data = { age, role, nationality, sex };
    setMeInfo(data);
    router.push("/profile");
  };

  return (
    <>
      <Card className="mt-20 mb-10 mx-auto p-6 max-w-200">
        <CardHeader className="text-center ">
          <CardTitle className="mx-auto">Welcome to Flint.ai</CardTitle>
          <CardDescription className="font-semibold mx-auto">
            We require some basic information to be able to set up your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-auto flex-1 flex flex-col items-center justify-center mt-6">
          <div className="grid md:grid-cols-2 md:grid-rows-2 gap-6 md:gap-10">
            <div>
              <Label className="mb-2 ml-2 text-stone-500 font-semibold">
                Nationality
              </Label>
              <ComboBox
                dataArray={countries}
                dataName="country"
                setterFunc={setNationality}
              />
            </div>
            <div>
              <Label className="mb-2 ml-2 text-stone-500 font-semibold">
                Role
              </Label>
              <ComboBox
                dataArray={roles}
                dataName="role"
                setterFunc={setRole}
              />
            </div>

            <div>
              <Label className="mb-2 ml-2 text-stone-500 font-semibold">
                Age
              </Label>
              <Input
                type="number"
                value={age}
                onChange={(e) => {
                  setAge(Number(e.target.value));
                }}
              />
            </div>
            <div>
              <Label className="mb-3 text-stone-500 font-semibold">
                Gender
              </Label>
              <RadioGroup
                onValueChange={(v: "Male" | "Female" | "Other") => {
                  setSex(v);
                }}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Male" id="r1" />
                  <Label htmlFor="r1">Male</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Female" id="r2" />
                  <Label htmlFor="r2">Female</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Other" id="r3" />
                  <Label htmlFor="r3">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button
            className="cursor-pointer justify-end mt-10 hover:opacity-45"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </CardContent>
        {/* footer on the bottom */}
        <CardFooter className=" flex flex-col justify-end text-center text-xs text-stone-400">
          We be buildin'
        </CardFooter>
      </Card>
    </>
  );
}
