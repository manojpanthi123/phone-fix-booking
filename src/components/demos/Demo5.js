import { useState } from "react";
import { courtesyList, formatMoney } from "../../utils/helpers";

function Demo5() {
  const phones = courtesyList.filter((item) => item.type === "phone");
  const chargers = courtesyList.filter((item) => item.type === "charger");
  const [phone, setPhone] = useState(null);
  const [charger, setCharger] = useState(null);
  const [business, setBusiness] = useState(false);

  function placeItem(item) {
    if (!item) return;
    if (item.type === "phone") setPhone(item);
    if (item.type === "charger") setCharger(item);
  }

  const bond = business ? 0 : (phone ? phone.bond : 0) + (charger ? charger.bond : 0);

  return (
    <section>
      <h3>Demo 5: Drag a courtesy phone</h3>
      <p>
        Drag one phone and one charger into the loan box. A business customer is
        not charged a bond.
      </p>
      <label className="demo-business">
        <input type="checkbox" checked={business} onChange={(event) => setBusiness(event.target.checked)} />
        Business customer
      </label>
      <div className="loan-board">
        <div>
          <h4>Phones</h4>
          {phones.map((item) => (
            <div
              key={item.id}
              className="loan-card"
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", String(item.id))}
            >
              {item.name} — {formatMoney(item.bond)}
            </div>
          ))}
          <h4>Chargers</h4>
          {chargers.map((item) => (
            <div
              key={item.id}
              className="loan-card"
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", String(item.id))}
            >
              {item.name} — {formatMoney(item.bond)}
            </div>
          ))}
        </div>
        <div
          className="loan-drop"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const id = Number(event.dataTransfer.getData("text/plain"));
            placeItem(courtesyList.find((entry) => entry.id === id));
          }}
        >
          <h4>Loan box</h4>
          <p>{phone ? phone.name : "Drop one phone here"}</p>
          <p>{charger ? charger.name : "Drop one charger here"}</p>
          <p className="demo-result">Bond: {formatMoney(bond)}</p>
        </div>
      </div>
    </section>
  );
}

export default Demo5;
