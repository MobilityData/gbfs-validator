const gbfs = require("./validation/stationStatus");

console.log(
  "has error",
  gbfs({
    last_updated: 1539865576,
    ttl: 60,
    data: {
      stations: [
        {
          station_id: "48289",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48290",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48291",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48292",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48294",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48295",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48296",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48297",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "48298",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65746",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65749",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65756",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65757",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65758",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65759",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65760",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65761",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65762",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121176",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "264651",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "345233",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "348377",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "691161",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "2709708",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "8800869",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7418",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7430",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7431",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7433",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7434",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7443",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7515",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7946",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7947",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7949",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7951",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7957",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7960",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7961",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7962",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7963",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7966",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7967",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7968",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "7969",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "9172",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "9192",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "11184",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "45250",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "45251",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "45252",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "45253",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65751",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "66248",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "66285",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "92822",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121182",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121183",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121207",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187153",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "200874",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "205093",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "264652",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42835",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42837",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42839",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42840",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42842",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42845",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42847",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42851",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42853",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42854",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42856",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42857",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42858",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42859",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42860",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42861",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42863",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42864",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42865",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42867",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42869",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42870",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42872",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42874",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "42875",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44630",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121178",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "260662",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "547442",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "628526",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43847",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43848",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43849",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43850",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43851",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44612",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44615",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "110203",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43855",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43856",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43857",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "43858",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44621",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44622",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44624",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44626",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "44629",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46197",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46216",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46248",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "66533",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121200",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121202",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "349246",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46614",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46616",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46617",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46618",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "46619",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54635",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54636",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54637",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54640",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54641",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54643",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54645",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "54647",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65750",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "66964",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "350606",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "6105198",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65807",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70106",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65803",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65805",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65806",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "47461",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "47462",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "47463",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "47465",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "47472",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70247",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70248",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70249",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70252",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70254",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70255",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70257",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70258",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70259",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "70344",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121169",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121171",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "202968",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "350587",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "350589",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "350599",
          num_bikes_available: 1,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "722184",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65778",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65780",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65781",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65782",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65784",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65785",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "72199",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "78147",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "721877",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "72203",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "72371",
          num_bikes_available: 0,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "121181",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "90401",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "90402",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "47469",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "102628",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "102629",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "102631",
          num_bikes_available: 2,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187119",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187145",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187148",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187151",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187164",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "65810",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187131",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "691315",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187157",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187158",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187159",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "187160",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "200895",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "200896",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "722282",
          num_bikes_available: 3,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "2709769",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "2709787",
          num_bikes_available: 5,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "2709799",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        },
        {
          station_id: "47455",
          num_bikes_available: 4,
          num_docks_available: 0,
          is_installed: 1,
          is_renting: 1,
          is_returning: 1,
          last_reported: 1539865576
        }
      ]
    }
  })
);
