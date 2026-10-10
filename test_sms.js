async function testSms() {
  console.log("Testing Shift Swap SMS Integration...");

  // Get shifts
  const shiftsRes = await fetch("http://localhost:5000/api/shifts");
  const shifts = await shiftsRes.json();
  const shift = shifts[0];

  // Submit Shift Swap Request
  const swapRes = await fetch("http://localhost:5000/api/shifts/swaps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shiftId: shift.id,
      requestingStaffId: "prof_mgr_01",
      targetStaffId: "prof_chef_01",
      reason: "Family emergency in Banjul, urgent swap requested"
    })
  });
  const swapData = await swapRes.json();
  console.log("? Shift Swap Requested ID:", swapData.id);

  // Approve Shift Swap (Manager decision SMS)
  const decisionRes = await fetch(`http://localhost:5000/api/shifts/swaps/${swapData.id}/decision`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      decision: "approved",
      reviewedByUserId: "usr_admin_01"
    })
  });
  const decisionData = await decisionRes.json();
  console.log("? Shift Swap Decision:", decisionData.manager_approval_status);
}

testSms().catch(console.error);
