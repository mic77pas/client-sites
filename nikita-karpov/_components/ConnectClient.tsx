"use client";

import dynamic from "next/dynamic";

const Connect = dynamic(() => import("./Connect"), { ssr: false });

export default function ConnectClient() {
  return <Connect />;
}
