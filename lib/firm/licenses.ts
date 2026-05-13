export interface FirmSeatState {
  license_seats: number;
  active_users: number;
  override?: boolean;
}

export function canInviteFirmUser(firm: FirmSeatState) {
  if (firm.override) {
    return { allowed: true, remainingSeats: Math.max(firm.license_seats - firm.active_users, 0) };
  }

  const remainingSeats = firm.license_seats - firm.active_users;
  return {
    allowed: remainingSeats > 0,
    remainingSeats: Math.max(remainingSeats, 0),
    message:
      remainingSeats > 0
        ? undefined
        : 'License seats are full. Upgrade the firm subscription before inviting another active user.'
  };
}

export function countActiveSeats(users: Array<{ status: string }>) {
  return users.filter((user) => user.status === 'active').length;
}
