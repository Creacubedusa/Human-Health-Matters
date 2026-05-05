export async function submitGuestDonation(_amount: number, _frequency: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 1500));
}
