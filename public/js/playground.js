let arr = [
    {'name': 'jim bob'},
    {'name': 'jane doe'},
    {'name': 'nathan measey'},
    {'name': 'eb measey'},
    {'name': 'tobias london'}
  ];
  let timespan = [
      {
          "start": "2022-02-28",
          "end": "2022-03-06",
          "days": [
              {
                  "date": "2022-03-01",
                  "dayint": 2,
                  "day": "Tue"
              },
              {
                  "date": "2022-03-02",
                  "dayint": 3,
                  "day": "Wed"
              },
              {
                  "date": "2022-03-03",
                  "dayint": 4,
                  "day": "Thu"
              },
              {
                  "date": "2022-03-04",
                  "dayint": 5,
                  "day": "Fri"
              },
              {
                  "date": "2022-03-05",
                  "dayint": 6,
                  "day": "Sat"
              },
              {
                  "date": "2022-03-06",
                  "dayint": 7,
                  "day": "Sun"
              }
          ]
      },
      {
          "start": "2022-03-07",
          "end": "2022-03-13",
          "days": [
              {
                  "date": "2022-03-07",
                  "dayint": 1,
                  "day": "Mon"
              },
              {
                  "date": "2022-03-08",
                  "dayint": 2,
                  "day": "Tue"
              },
              {
                  "date": "2022-03-09",
                  "dayint": 3,
                  "day": "Wed"
              },
              {
                  "date": "2022-03-10",
                  "dayint": 4,
                  "day": "Thu"
              },
              {
                  "date": "2022-03-11",
                  "dayint": 5,
                  "day": "Fri"
              },
              {
                  "date": "2022-03-12",
                  "dayint": 6,
                  "day": "Sat"
              },
              {
                  "date": "2022-03-13",
                  "dayint": 7,
                  "day": "Sun"
              }
          ]
      },
      {
          "start": "2022-03-14",
          "end": "2022-03-20",
          "days": [
              {
                  "date": "2022-03-14",
                  "dayint": 1,
                  "day": "Mon"
              },
              {
                  "date": "2022-03-15",
                  "dayint": 2,
                  "day": "Tue"
              },
              {
                  "date": "2022-03-16",
                  "dayint": 3,
                  "day": "Wed"
              },
              {
                  "date": "2022-03-17",
                  "dayint": 4,
                  "day": "Thu"
              },
              {
                  "date": "2022-03-18",
                  "dayint": 5,
                  "day": "Fri"
              },
              {
                  "date": "2022-03-19",
                  "dayint": 6,
                  "day": "Sat"
              },
              {
                  "date": "2022-03-20",
                  "dayint": 7,
                  "day": "Sun"
              }
          ]
      },
      {
          "start": "2022-03-21",
          "end": "2022-03-27",
          "days": [
              {
                  "date": "2022-03-21",
                  "dayint": 1,
                  "day": "Mon"
              },
              {
                  "date": "2022-03-22",
                  "dayint": 2,
                  "day": "Tue"
              },
              {
                  "date": "2022-03-23",
                  "dayint": 3,
                  "day": "Wed"
              },
              {
                  "date": "2022-03-24",
                  "dayint": 4,
                  "day": "Thu"
              },
              {
                  "date": "2022-03-25",
                  "dayint": 5,
                  "day": "Fri"
              },
              {
                  "date": "2022-03-26",
                  "dayint": 6,
                  "day": "Sat"
              },
              {
                  "date": "2022-03-27",
                  "dayint": 7,
                  "day": "Sun"
              }
          ]
      },
      {
          "start": "2022-03-28",
          "end": "2022-04-03",
          "days": [
              {
                  "date": "2022-03-28",
                  "dayint": 1,
                  "day": "Mon"
              },
              {
                  "date": "2022-03-29",
                  "dayint": 2,
                  "day": "Tue"
              },
              {
                  "date": "2022-03-30",
                  "dayint": 3,
                  "day": "Wed"
              },
              {
                  "date": "2022-03-31",
                  "dayint": 4,
                  "day": "Thu"
              }
          ]
      }
  ];
debugger;
//   arr = arr.map((a,i) => {
//     a.enrolments = timespan;
//     a.loop = i;
//     a.enrolments = a.enrolments.map((e,j)=> {
//         console.log(`i=${i} && j=${j}`);
//         e.items = [i,j];
//         console.log(e.items);
//         return e; 
//     }) 
//     return a;
//   });
for(let i=0;i<arr.length;i++) {
    let a = arr[i]; 
    console.log(i); 
    for(let j=0;j<a.enrolments.length;j++){

    }
}
console.log(arr);