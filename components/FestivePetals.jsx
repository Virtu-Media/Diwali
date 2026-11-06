const PETALS = [
  { left: "4%", delay: "-3s", duration: "18s", drift: "75px", width: "9px", height: "13px" },
  { left: "13%", delay: "-11s", duration: "22s", drift: "-55px", width: "8px", height: "12px" },
  { left: "24%", delay: "-7s", duration: "20s", drift: "65px", width: "11px", height: "16px" },
  { left: "36%", delay: "-15s", duration: "24s", drift: "-70px", width: "8px", height: "12px" },
  { left: "49%", delay: "-5s", duration: "19s", drift: "55px", width: "10px", height: "15px" },
  { left: "62%", delay: "-13s", duration: "23s", drift: "-65px", width: "9px", height: "13px" },
  { left: "74%", delay: "-8s", duration: "21s", drift: "70px", width: "11px", height: "16px" },
  { left: "85%", delay: "-17s", duration: "25s", drift: "-50px", width: "8px", height: "12px" },
  { left: "95%", delay: "-10s", duration: "20s", drift: "45px", width: "10px", height: "15px" },
];

export default function FestivePetals() {
  return (
    <div className="festive-petals" aria-hidden="true">
      {PETALS.map((petal, index) => (
        <span
          key={index}
          className="festive-petal"
          style={{
            left: petal.left,
            width: petal.width,
            height: petal.height,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            "--petal-drift": petal.drift,
          }}
        />
      ))}
    </div>
  );
}
