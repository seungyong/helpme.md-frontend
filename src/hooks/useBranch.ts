import { useMemo } from "react";

import { ApiError } from "@src/types/error";
import { Branches } from "@src/types/repository";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const mockBranches: Branches = {
  branches: ["main", "develop", "feature/1", "feature/2", "feature/3"],
};

export const useBranch = () => {
  const { owner, name } = useParams();

  const { data: branches, isSuccess } = useQuery<Branches, ApiError, string[]>({
    queryKey: ["branches", owner, name],
    queryFn: () => Promise.resolve(mockBranches),
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
