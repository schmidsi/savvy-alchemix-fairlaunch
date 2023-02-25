import { Transfer as TransferEvent } from "../generated/AlchemixERC20/AlchemixERC20";
import { EligibleAddress, Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let eligibleAddress = EligibleAddress.load(event.params.to);

  if (!eligibleAddress) {
    eligibleAddress = new EligibleAddress(event.params.to);
    eligibleAddress.reason = "Had ALCS token once";
    eligibleAddress.save();
  }

  entity.save();
}
