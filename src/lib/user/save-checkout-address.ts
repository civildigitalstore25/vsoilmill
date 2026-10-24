import type { ShippingAddress } from "@/types/user";
import { UserModel } from "@/models/User";
import { isSameShippingAddress, toSavedAddress } from "@/lib/user/addresses";

export async function saveCheckoutAddressForUser(
  userId: string,
  address: ShippingAddress,
): Promise<void> {
  const user = await UserModel.findById(userId);
  if (!user) return;

  const existingIndex = user.addresses.findIndex((saved: ShippingAddress) =>
    isSameShippingAddress(saved, address),
  );

  if (existingIndex >= 0) {
    const previous = user.addresses[existingIndex] as ShippingAddress | undefined;
    user.addresses[existingIndex] = toSavedAddress(
      address,
      Boolean(previous?.isDefault) || user.addresses.length === 1,
    );
  } else {
    const isFirst = user.addresses.length === 0;
    if (isFirst) {
      user.addresses.forEach((addr: ShippingAddress) => {
        addr.isDefault = false;
      });
    }
    user.addresses.push(toSavedAddress(address, isFirst));
  }

  await user.save();
}
