import { useState, useEffect } from "react";

export default function CleaningEstimator() {
  const [sqft, setSqft] = useState(0);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [kitchens, setKitchens] = useState(1);
  const [diningRooms, setDiningRooms] = useState(1);
  const [livingRooms, setLivingRooms] = useState(1);
  const [offices, setOffices] = useState(0);
  const [closets, setClosets] = useState(0);
  const [laundryRooms, setLaundryRooms] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [pets, setPets] = useState(false);
  const [kids, setKids] = useState(false);
  const [basement, setBasement] = useState(false);

  const deepCleanRate = 360;

  const getBaseRate = () => {
    if (sqft >= 701 && sqft <= 900) return 150;
    if (sqft >= 300 && sqft <= 500) return 105;
    if (sqft >= 501 && sqft <= 700) return 120;
    if (sqft >= 901 && sqft <= 1100) return 165;
    if (sqft >= 1101 && sqft <= 1300) return 180;
    if (sqft >= 1301 && sqft <= 1500) return 195;
    if (sqft > 1500) return 210;
    return 0;
  };

  useEffect(() => {
    const updatedRooms = [];
    for (let i = 1; i <= bedrooms; i++) updatedRooms.push({ name: `Bedroom ${i}`, floor: "carpet", editable: true });
    for (let i = 1; i <= diningRooms; i++) updatedRooms.push({ name: `Dining Room ${i}`, floor: "carpet", editable: true });
    for (let i = 1; i <= livingRooms; i++) updatedRooms.push({ name: `Living Room ${i}`, floor: "carpet", editable: true });
    for (let i = 1; i <= offices; i++) updatedRooms.push({ name: `Office ${i}`, floor: "carpet", editable: true });
    for (let i = 1; i <= closets; i++) updatedRooms.push({ name: `Closet ${i}`, floor: "carpet", editable: true });
    for (let i = 1; i <= kitchens; i++) updatedRooms.push({ name: `Kitchen ${i}`, floor: "tile", editable: false });
    for (let i = 1; i <= bathrooms; i++) updatedRooms.push({ name: `Bathroom ${i}`, floor: "tile", editable: false });
    for (let i = 1; i <= laundryRooms; i++) updatedRooms.push({ name: `Laundry Room ${i}`, floor: "tile", editable: false });
    setRooms(updatedRooms);
  }, [bedrooms, diningRooms, livingRooms, offices, closets, kitchens, bathrooms, laundryRooms]);

  const updateFloor = (index, value) => {
    const updated = [...rooms];
    if (updated[index].editable) {
      updated[index].floor = value;
      setRooms(updated);
    }
  };

  const calculate = () => {
    const isDefault = sqft >= 701 && sqft <= 900 && bedrooms === 2 && bathrooms === 1 && kitchens === 1 && diningRooms === 1 && livingRooms === 1 && offices === 0 && closets === 0 && laundryRooms === 0 && !pets && !kids && !basement;
    let total = isDefault ? 150 : getBaseRate();

    if (!isDefault) {
      total += rooms.length * 10;
      rooms.forEach(r => total += r.floor === "tile" ? 5 : 0);
      if (pets) total *= 1.1;
      if (kids) total *= 1.1;
      if (basement) total += sqft * 0.1;
    }

    const weekly = total * 0.87;
    const monthly = total * 1.2;
    const deep = deepCleanRate * (sqft / 890);
    return {
      weekly: weekly.toFixed(2),
      biWeekly: total.toFixed(2),
      monthly: monthly.toFixed(2),
      deep: deep.toFixed(2)
    };
  };

  const rates = calculate();

  const numberOptions = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="min-h-screen bg-black p-6 text-white font-mono">
      <div className="max-w-6xl mx-auto bg-neutral-900 shadow-xl rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-orange-400">🧼 Cleaning Estimate Calculator</h2>
          <label className="block mb-2">Square Feet:
            <select value={sqft} onChange={e => setSqft(Number(e.target.value))} className="w-full mt-1 rounded bg-neutral-800 text-white px-3 py-2">
              <option value={0}>Select...</option>
              <option value={300}>300 - 500 sq ft</option>
              <option value={501}>501 - 700 sq ft</option>
              <option value={701}>701 - 900 sq ft</option>
              <option value={901}>901 - 1100 sq ft</option>
              <option value={1101}>1101 - 1300 sq ft</option>
              <option value={1301}>1301 - 1500 sq ft</option>
              <option value={1501}>1501+ sq ft</option>
            </select>
          </label>

          {[['Bedrooms', bedrooms, setBedrooms], ['Bathrooms', bathrooms, setBathrooms], ['Kitchens', kitchens, setKitchens], ['Dining Rooms', diningRooms, setDiningRooms], ['Living Rooms', livingRooms, setLivingRooms], ['Offices', offices, setOffices], ['Closets', closets, setClosets], ['Laundry Rooms', laundryRooms, setLaundryRooms]].map(([label, value, setter], i) => (
            <label className="block mb-2" key={i}>{label}:
              <select value={value} onChange={e => setter(Number(e.target.value))} className="w-full mt-1 rounded bg-neutral-800 text-white px-3 py-2">
                {numberOptions.map((opt, j) => (
                  <option key={j} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          ))}

          {[['Pets', pets, setPets], ['Kids', kids, setKids], ['Includes Basement', basement, setBasement]].map(([label, value, setter], i) => (
            <label className="flex items-center space-x-2 mt-3" key={i}>
              <input type="checkbox" checked={value} onChange={() => setter(!value)} className="form-checkbox h-4 w-4 text-orange-500" />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-orange-300">Room Floor Types</h3>
          {rooms.filter(r => r.editable).map((room, i) => (
            <label className="block mb-2" key={i}>{room.name} Floor:
              <select value={room.floor} onChange={e => updateFloor(i, e.target.value)} className="w-full mt-1 rounded bg-neutral-800 text-white px-3 py-2">
                <option value="carpet">Carpet</option>
                <option value="tile">Hardwood/Tile</option>
              </select>
            </label>
          ))}

          <div className="bg-neutral-800 text-white rounded-xl shadow-inner p-4 mt-6">
            <p className="text-lg font-semibold">📆 <strong>Weekly:</strong> ${rates.weekly}</p>
            <p className="text-lg font-semibold">💰 <strong>Bi-weekly:</strong> ${rates.biWeekly}</p>
            <p className="text-lg font-semibold">📅 <strong>Monthly:</strong> ${rates.monthly}</p>
            <p className="text-lg font-semibold">🧽 <strong>Deep Clean:</strong> ${rates.deep}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
