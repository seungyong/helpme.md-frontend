import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { ApiError } from "@src/types/error";
import { Branches } from "@src/types/repository";
import { apiClient } from "@src/utils/apiClient";
import { APIEndpoint, generateAPIEndpoint } from "@src/types/APIEndpoint";

export const useBranch = () => {
  const { owner, name } = useParams();

  const { data: branches, isSuccess } = useQuery<Branches, ApiError, string[]>({
    queryKey: ["branches", owner, name],
    queryFn: () =>
      apiClient
        .get<Branches>(
          generateAPIEndpoint(APIEndpoint.BRANCHES, owner || "", name || "")
        )
        .then((response) => response.data),
    select: (data: Branches) => data.branches,
    enabled: !!owner && !!name,
  });

  const initialBranch = useMemo(() => {
    return branches?.[0] || "";
  }, [branches]);

  return {
    branches: branches || [],
    initialBranch,
    isSuccess,
  };
};
