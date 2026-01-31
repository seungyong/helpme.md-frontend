import { useContext } from "react";
import { AuthContext } from "@src/context/AuthContext";

export const useAuthContext = () => useContext(AuthContext);
