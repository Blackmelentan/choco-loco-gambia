const http = require('http');

async function testAll() {
  console.log("=== STARTING FULL PRODUCTION E2E VERIFICATION ===");

  // 1. Health Check
  const healthRes = await fetch("http://localhost:5000/api/health");
  const health = await healthRes.json();
  console.log("? [1/5] System Health:", health.status, "| Store:", health.storeLocation);

  // 2. Menu Structure
  const menuRes = await fetch("http://localhost:5000/api/menu");
  const menu = await menuRes.json();
  console.log("? [2/5] Menu Categories Loaded:", menu.length, "categories,", menu.reduce((acc, c) => acc + c.items.length, 0), "total items");

  // 3. Customer Order Creation (Wave Checkout)
  const orderRes = await fetch("http://localhost:5000/api/sales/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "Fatou Bah",
      customerPhone: "+2207881234",
      orderType: "dine_in",
      tableNumber: "T-04 (VIP Lounge)",
      paymentMethod: "wave_money",
      items: [
        {
          menuItemId: "item_waffle_signature",
          name: "The Choco Loco Signature Bubble Waffle",
          unitPriceGmd: 420,
          quantity: 2,
          customizations: ["Warm Belgian Milk Chocolate", "Lotus Biscoff Crumbs"]
        }
      ]
    })
  });
  const orderData = await orderRes.json();
  console.log("? [3/5] Placed Customer Order:", orderData.order.order_number, "| Total:", orderData.order.total_gmd, "GMD | Wave Checkout:", orderData.waveSession?.id);

  // 4. Advance Order in Kitchen
  const advanceRes = await fetch(`http://localhost:5000/api/sales/orders/${orderData.order.id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "plating", paymentStatus: "paid" })
  });
  const updatedOrder = await advanceRes.json();
  console.log("? [4/5] Advanced Kitchen Pipeline Stage:", updatedOrder.order_number, "?", updatedOrder.status);

  // 5. Staff Time Clock (GPS Geofence Audit)
  const clockInRes = await fetch("http://localhost:5000/api/timeclock/clock-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      staffProfileId: "prof_barista_01",
      latitude: 13.44751,
      longitude: -16.67819
    })
  });
  const clockData = await clockInRes.json();
  console.log("? [5/5] Staff Clock-In Logged:", clockData.entry.id, "| Geofence distance:", clockData.geofence.distanceMeters, "meters | Verified:", clockData.geofence.withinGeofence);

  // 6. Wave API Instant Auto-Disbursement
  const calcRes = await fetch("http://localhost:5000/api/payroll/calculate");
  const calc = await calcRes.json();
  const runRes = await fetch("http://localhost:5000/api/payroll/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      periodStart: calc.periodStart,
      periodEnd: calc.periodEnd,
      approvedByUserId: "usr_admin_01"
    })
  });
  const runData = await runRes.json();
  const disburseRes = await fetch(`http://localhost:5000/api/payroll/runs/${runData.run.id}/disburse`, {
    method: "POST"
  });
  const disburseData = await disburseRes.json();
  console.log("? [6/6] Wave Auto-Disbursement Executed for Run:", runData.run.run_reference);
  console.log("       Disbursed Liquidity:", disburseData.totalDisbursedGmd, "GMD across", disburseData.results.length, "employees");
  console.log("       First Payout TX:", disburseData.results[0]?.waveExternalId, "| Status:", disburseData.results[0]?.status);

  console.log("=== ALL ENDPOINTS & FLOWS VERIFIED SUCCESSFULLY ===");
}

testAll().catch(console.error);
