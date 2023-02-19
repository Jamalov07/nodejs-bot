export async function addMinutes(time, minsToAdd) {
  try {
    // function D(J){ return (J<10? '0':'') + J;};
    // var piece = time.split(':');
    // var mins = piece[0]*60 + +piece[1] + +minsToAdd;

    // return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);
    return new Date(
      new Date("1970/01/01 " + time).getTime() + minsToAdd * 60000
    ).toLocaleTimeString("en-UK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.log(error);
  }
}
export async function parseTime(s) {
  try {
    var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
    var hh = parseInt(part[1], 10);
    var mm = parseInt(part[2], 10);
    var ap = part[3] ? part[3].toUpperCase() : null;
    if (ap === "AM") {
      if (hh == 12) {
        hh = 0;
      }
    }
    if (ap === "PM") {
      if (hh != 12) {
        hh += 12;
      }
    }
    return { hh: hh, mm: mm };
  } catch (error) {
    console.log(error);
  }
}
