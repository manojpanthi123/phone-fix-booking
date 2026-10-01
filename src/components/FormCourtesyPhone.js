import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { courtesyList, findItem, formatMoney } from "../utils/helpers";

function FormCourtesyPhone({ passDataToParent, sendCourtesyDetails }, ref) {
  const [phoneBorrow, setPhoneBorrow] = useState(0);
  const [chargerBorrow, setChargerBorrow] = useState(0);

  const phones = courtesyList.filter((item) => item.type === "phone");
  const chargers = courtesyList.filter((item) => item.type === "charger");

  function sendBond(nextPhone, nextCharger) {
    const bond = findItem(nextPhone).bond + findItem(nextCharger).bond;
    passDataToParent(bond);
  }

  function addPhone(value) {
    const id = value === "none" ? 0 : Number(value);
    setPhoneBorrow(id);
    sendBond(id, chargerBorrow);
  }

  function addCharger(value) {
    const id = value === "none" ? 0 : Number(value);
    setChargerBorrow(id);
    sendBond(phoneBorrow, id);
  }

  function reset() {
    setPhoneBorrow(0);
    setChargerBorrow(0);
    passDataToParent(0);
  }

  useEffect(() => {
    sendCourtesyDetails({
      phone: phoneBorrow === 0 ? null : findItem(phoneBorrow),
      charger: chargerBorrow === 0 ? null : findItem(chargerBorrow)
    });
  }, [phoneBorrow, chargerBorrow, sendCourtesyDetails]);

  useImperativeHandle(ref, () => ({
    reset,
    getData: () => ({
      phone: phoneBorrow === 0 ? null : findItem(phoneBorrow),
      charger: chargerBorrow === 0 ? null : findItem(chargerBorrow)
    })
  }));

  return (
    <section className="panel courtesy-panel" aria-labelledby="courtesy-heading">
      <h2 id="courtesy-heading">Courtesy Phone</h2>

      <h4>Choose a phone:</h4>
      <div className="field">
        <label htmlFor="phoneList">Item Type</label>
        <select
          id="phoneList"
          value={phoneBorrow === 0 ? "none" : String(phoneBorrow)}
          onChange={(e) => addPhone(e.target.value)}
        >
          <option value="none">None</option>
          {phones.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — ${item.bond}
            </option>
          ))}
        </select>
      </div>

      <h4>Choose a charger:</h4>
      <div className="field">
        <label htmlFor="chargerList">Item Type</label>
        <select
          id="chargerList"
          value={chargerBorrow === 0 ? "none" : String(chargerBorrow)}
          onChange={(e) => addCharger(e.target.value)}
        >
          <option value="none">None</option>
          {chargers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — ${item.bond}
            </option>
          ))}
        </select>
      </div>

      <table className="courtesy-table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Cost</th>
          </tr>
        </thead>
        <tbody>
          {phoneBorrow !== 0 && (
            <tr>
              <td>{findItem(phoneBorrow).name}</td>
              <td>{formatMoney(findItem(phoneBorrow).bond)}</td>
            </tr>
          )}
          {chargerBorrow !== 0 && (
            <tr>
              <td>{findItem(chargerBorrow).name}</td>
              <td>{formatMoney(findItem(chargerBorrow).bond)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default forwardRef(FormCourtesyPhone);
