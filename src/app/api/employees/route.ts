import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch employee record for the user first
  const { data: employeeData, error: employeeError } = await supabase
    .from("employees")
    .select("*")
    .eq("id", user.id)
    .single();

  if (employeeError) {
    return NextResponse.json({ error: employeeError.message }, { status: 500 });
  }

  // If user is admin, fetch all employees in batches
  if (employeeData.role === "admin") {
    let allData: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let fetched = 0;

    do {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .range(from, from + batchSize - 1);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (data && data.length > 0) {
        allData = allData.concat(data);
        fetched = data.length;
        from += batchSize;
      } else {
        fetched = 0;
      }
    } while (fetched === batchSize);

    return NextResponse.json(allData);
  }

  // Non-admin: return only their own record
  return NextResponse.json([employeeData]);
}
