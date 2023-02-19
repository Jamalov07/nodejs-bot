import axios from "axios";
export async function getDistance(from_lat, from_lon, to_lat, to_lon) {
  try {
    let config = {
      method: "GET",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from_lat}%2C${from_lon}&destinations=${to_lat}%2C${to_lon}&key=${process.env.GOOGLE_API_KEY}`,
      headers: {},
    };
    const response = await axios(config);
    let distance_data = response.data;
    let distance = (
      distance_data.rows[0].elements[0].distance.value / 1000
    ).toFixed(1);
    return +distance;
  } catch (error) {
    console.log(error);
  }
}
