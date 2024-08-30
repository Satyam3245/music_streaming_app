import option from "@/lib/auth";
import nextAuth from "next-auth";

const handler = nextAuth(option);

export {handler as GET , handler as POST}