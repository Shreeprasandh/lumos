import { BomItem, DistributionBoard, FixtureSpec } from './types';

/**
 * Compiles audit-grade 6-Tier Bill of Quantities (BOM/BOQ)
 * with catalog numbers, HSN tax classifications, and L&T SuFin unit rates.
 */
export function compileSixTierBOM(
  totalFixtures: number,
  fixtureSpec: FixtureSpec,
  totalConduitMeters: number,
  totalWireMeters: number,
  dbs: DistributionBoard[]
): BomItem[] {
  const emergencyCount = Math.ceil(totalFixtures * 0.15); // 15% statutory egress lighting
  const junctionBoxCount = Math.ceil(totalConduitMeters / 16.5);
  const saddleCount = Math.ceil(totalConduitMeters * 2);
  const totalCircuits = dbs.reduce((sum, db) => sum + db.circuits.length, 0);

  const items: BomItem[] = [
    // TIER 1: LUMINAIRES
    {
      id: 'BOM-T1-01',
      tier: 1,
      tierName: 'Luminaires',
      itemDescription: `${fixtureSpec.model} (36W, 4000K, CRI>80, UGR<19)`,
      catalogCode: fixtureSpec.catalogCode,
      hsnCode: fixtureSpec.hsnCode,
      quantity: totalFixtures,
      unit: 'Nos',
      unitRateINR: fixtureSpec.unitCostINR,
      totalAmountINR: totalFixtures * fixtureSpec.unitCostINR
    },

    // TIER 2: DRIVERS & EMERGENCY
    {
      id: 'BOM-T2-01',
      tier: 2,
      tierName: 'Drivers & Emergency',
      itemDescription: 'DALI-2 / 1-10V Dimmable Constant Current LED Driver 36W',
      catalogCode: 'LT-DRV-DALI-36W',
      hsnCode: '85044090',
      quantity: totalFixtures,
      unit: 'Nos',
      unitRateINR: 1800,
      totalAmountINR: totalFixtures * 1800
    },
    {
      id: 'BOM-T2-02',
      tier: 2,
      tierName: 'Drivers & Emergency',
      itemDescription: '3-Hour Emergency LiFePO4 Inverter Battery Backup Pack',
      catalogCode: 'LT-EMG-MOD-3HR',
      hsnCode: '85044090',
      quantity: emergencyCount,
      unit: 'Nos',
      unitRateINR: 3200,
      totalAmountINR: emergencyCount * 3200
    },

    // TIER 3: CONDUITS & ENCLOSURES
    {
      id: 'BOM-T3-01',
      tier: 3,
      tierName: 'Conduits & Enclosures',
      itemDescription: '20mm Class-B Heavy Duty Hot-Dip Galvanised (GI) Conduit (IS 9537)',
      catalogCode: 'LT-CND-GI-20MM',
      hsnCode: '73063090',
      quantity: Math.round(totalConduitMeters * 0.85),
      unit: 'Mtrs',
      unitRateINR: 95,
      totalAmountINR: Math.round(totalConduitMeters * 0.85) * 95
    },
    {
      id: 'BOM-T3-02',
      tier: 3,
      tierName: 'Conduits & Enclosures',
      itemDescription: '25mm Class-B GI Feeder Trunk Conduit (IS 9537)',
      catalogCode: 'LT-CND-GI-25MM',
      hsnCode: '73063090',
      quantity: Math.round(totalConduitMeters * 0.15),
      unit: 'Mtrs',
      unitRateINR: 125,
      totalAmountINR: Math.round(totalConduitMeters * 0.15) * 125
    },
    {
      id: 'BOM-T3-03',
      tier: 3,
      tierName: 'Conduits & Enclosures',
      itemDescription: 'Circular Malleable Iron Junction Boxes (1/2/3/4-Way)',
      catalogCode: 'LT-BOX-JB-CI20',
      hsnCode: '73269099',
      quantity: junctionBoxCount,
      unit: 'Nos',
      unitRateINR: 85,
      totalAmountINR: junctionBoxCount * 85
    },

    // TIER 4: WIRING & CABLING
    {
      id: 'BOM-T4-01',
      tier: 4,
      tierName: 'Wiring & Cabling',
      itemDescription: '1.5 mm² FRLS PVC Insulated Stranded Copper Wire (Phase/Neutral/Earth)',
      catalogCode: 'LT-WIR-FRLS-1.5',
      hsnCode: '85444990',
      quantity: Math.round(totalWireMeters * 0.80),
      unit: 'Mtrs',
      unitRateINR: 18,
      totalAmountINR: Math.round(totalWireMeters * 0.80) * 18
    },
    {
      id: 'BOM-T4-02',
      tier: 4,
      tierName: 'Wiring & Cabling',
      itemDescription: '2.5 mm² FRLS PVC Insulated Copper Wire (Feeder Homing Runs)',
      catalogCode: 'LT-WIR-FRLS-2.5',
      hsnCode: '85444990',
      quantity: Math.round(totalWireMeters * 0.20),
      unit: 'Mtrs',
      unitRateINR: 28,
      totalAmountINR: Math.round(totalWireMeters * 0.20) * 28
    },

    // TIER 5: SWITCHGEAR & CONTROLS
    {
      id: 'BOM-T5-01',
      tier: 5,
      tierName: 'Switchgear & Controls',
      itemDescription: '8-Way TPN Distribution Board IP43 with 40A 30mA 4P RCCB Incomer',
      catalogCode: 'LT-SWG-DB-8TPN',
      hsnCode: '85371000',
      quantity: dbs.length,
      unit: 'Sets',
      unitRateINR: 14500,
      totalAmountINR: dbs.length * 14500
    },
    {
      id: 'BOM-T5-02',
      tier: 5,
      tierName: 'Switchgear & Controls',
      itemDescription: '10A Single Pole Type-C 10kA Miniature Circuit Breaker (IS/IEC 60898)',
      catalogCode: 'LT-SWG-MCB-10C',
      hsnCode: '85362030',
      quantity: totalCircuits,
      unit: 'Nos',
      unitRateINR: 380,
      totalAmountINR: totalCircuits * 380
    },
    {
      id: 'BOM-T5-03',
      tier: 5,
      tierName: 'Switchgear & Controls',
      itemDescription: '360° Ceiling Mount Dual-Technology PIR Occupancy Sensors',
      catalogCode: 'LT-CTL-PIR-360',
      hsnCode: '85365020',
      quantity: Math.ceil(totalFixtures / 24),
      unit: 'Nos',
      unitRateINR: 2200,
      totalAmountINR: Math.ceil(totalFixtures / 24) * 2200
    },

    // TIER 6: MOUNTING HARDWARE & LABOR
    {
      id: 'BOM-T6-01',
      tier: 6,
      tierName: 'Mounting & Labor',
      itemDescription: 'Heavy Gauge GI Conduit Saddles & Spacers (2 Nos/Meter)',
      catalogCode: 'LT-HDW-SDL-GI20',
      hsnCode: '73269099',
      quantity: saddleCount,
      unit: 'Nos',
      unitRateINR: 12,
      totalAmountINR: saddleCount * 12
    },
    {
      id: 'BOM-T6-02',
      tier: 6,
      tierName: 'Mounting & Labor',
      itemDescription: 'MEP Installation, Conduit Laying, Wire Pulling & Testing Labor',
      catalogCode: 'LT-LBR-MEP-INST',
      hsnCode: '99546100',
      quantity: totalFixtures,
      unit: 'Points',
      unitRateINR: 420,
      totalAmountINR: totalFixtures * 420
    }
  ];

  return items;
}

/**
 * Generates RFC 4180 CSV export formatted directly for L&T SuFin marketplace live RFQs.
 */
export function exportToSuFinCSV(items: BomItem[], projectName: string): string {
  const headers = [
    'Line No',
    'Tier',
    'Catalog Code',
    'Item Description',
    'HSN Code',
    'Quantity',
    'Unit',
    'Estimated Rate (INR)',
    'Line Total (INR)'
  ];

  const rows = items.map((item, idx) => [
    idx + 1,
    `Tier ${item.tier}: ${item.tierName}`,
    `"${item.catalogCode}"`,
    `"${item.itemDescription.replace(/"/g, '""')}"`,
    item.hsnCode,
    item.quantity,
    item.unit,
    item.unitRateINR.toFixed(2),
    item.totalAmountINR.toFixed(2)
  ]);

  const totalCost = items.reduce((sum, item) => sum + item.totalAmountINR, 0);
  rows.push([
    '',
    'TOTAL PROCUREMENT VALUE',
    '',
    `"Project: ${projectName}"`,
    '',
    '',
    '',
    'INR',
    totalCost.toFixed(2)
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Generates SAP Material Master (MM) XML format for automated ERP procurement entry.
 */
export function exportToSapMMXML(items: BomItem[], projectCode: string): string {
  const lineItems = items.map((item, idx) => `
    <BOM_ITEM>
      <ITEM_NO>${(idx + 1) * 10}</ITEM_NO>
      <MATERIAL_CODE>${item.catalogCode}</MATERIAL_CODE>
      <DESCRIPTION>${escapeXml(item.itemDescription)}</DESCRIPTION>
      <COMMODITY_CODE>${item.hsnCode}</COMMODITY_CODE>
      <QUANTITY>${item.quantity}</QUANTITY>
      <UNIT_OF_MEASURE>${item.unit.toUpperCase()}</UNIT_OF_MEASURE>
      <VALUATION_PRICE>${item.unitRateINR}</VALUATION_PRICE>
      <CURRENCY>INR</CURRENCY>
      <PLANT>1100</PLANT>
      <STORAGE_LOCATION>MEP1</STORAGE_LOCATION>
    </BOM_ITEM>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<SAP_BOM_UPLOAD>
  <HEADER>
    <PROJECT_ID>${projectCode}</PROJECT_ID>
    <SYSTEM>LUMOS-LIGHTING-ENGINE</SYSTEM>
    <TIMESTAMP>${new Date().toISOString()}</TIMESTAMP>
    <ITEM_COUNT>${items.length}</ITEM_COUNT>
  </HEADER>
  <ITEMS>${lineItems}
  </ITEMS>
</SAP_BOM_UPLOAD>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
