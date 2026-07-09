"use client";
import * as React from "react";
import type { TabKey } from "@/lib/nav";

// Kept as a no-op for compatibility with older imports. Navigation now lives
// in Sidebar and BottomNav.
export function DesktopTabs({
 active,
 onChange,
}: {
 active: TabKey;
 onChange: (key: TabKey) => void;
}) {
 void active;
 void onChange;
 return null;
}
