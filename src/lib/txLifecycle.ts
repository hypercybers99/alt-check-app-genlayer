export type TxState =
  | "idle"
  | "signing"
  | "submitting"
  | "consensus_pending"
  | "accepted"
  | "readback_confirming"
  | "completed"
  | "disagreed"
  | "reverted"
  | "timed_out";

export interface TxLifecycleOutcome {
  state: TxState;
  terminalLabel: string;
  txHash?: string;
  agreeCount?: number;
  totalVotes?: number;
  revertMessage?: string;
  rawStatus?: string;
  rawExecutionResult?: string;
}

export function deriveTerminalOutcome(params: {
  rawStatusName?: string;
  rawStatusCode?: number;
  executionResultName?: string;
  executionResultCode?: number;
  leaderVote?: string;
  agreeCount: number;
  totalVotes: number;
  revertPayload?: string;
  readbackConfirmed?: boolean;
}): TxLifecycleOutcome {
  const {
    rawStatusName = "",
    executionResultName = "",
    agreeCount,
    totalVotes,
    revertPayload,
    readbackConfirmed = false,
  } = params;

  const isRevert =
    executionResultName.toUpperCase() === "ERROR" ||
    executionResultName.toUpperCase() === "FAILED" ||
    Boolean(revertPayload);

  const isDisagree =
    rawStatusName.toUpperCase() === "UNDETERMINED" ||
    (agreeCount > 0 && totalVotes > 0 && agreeCount * 2 <= totalVotes) ||
    executionResultName.toUpperCase().includes("DISAGREE");

  if (isDisagree) {
    return {
      state: "disagreed",
      terminalLabel: `Validators did not agree (${agreeCount}/${totalVotes}) - state not applied`,
      agreeCount,
      totalVotes,
      rawStatus: rawStatusName,
      rawExecutionResult: executionResultName,
    };
  }

  if (isRevert) {
    return {
      state: "reverted",
      terminalLabel: revertPayload
        ? `Reverted - state not applied (${revertPayload})`
        : "Reverted - state not applied",
      revertMessage: revertPayload,
      agreeCount,
      totalVotes,
      rawStatus: rawStatusName,
      rawExecutionResult: executionResultName,
    };
  }

  if (readbackConfirmed) {
    return {
      state: "completed",
      terminalLabel: `Accepted by validators (${agreeCount}/${totalVotes} agreed) - state applied`,
      agreeCount,
      totalVotes,
      rawStatus: rawStatusName,
      rawExecutionResult: executionResultName,
    };
  }

  return {
    state: "accepted",
    terminalLabel: `Accepted by validators (${agreeCount}/${totalVotes} agreed) - confirming state`,
    agreeCount,
    totalVotes,
    rawStatus: rawStatusName,
    rawExecutionResult: executionResultName,
  };
}
