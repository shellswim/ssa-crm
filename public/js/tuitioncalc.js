let tcstudents = [{"sid": 12, "lastName": "Measey", "firstName": "Nathanael", "enrolments": [{"dropDate": null, "startDate": "2021-06-13", "enrolmentId": 4119, "classDetails": {"day": 6, "times": {"endTimeDecimal": 11.50, "endTimeDisplay": "11:30 AM", "startTimeDecimal": 11.00, "startTimeDisplay": "11:00 AM"}, "classId": 516, "baseRate": 18.8850, "classType": "Learn to Swim", "instructor": "John Z.", "classIsActive": 1, "maxEnrolments": 4}, "classMeetings": {"daysMeeting": 4, "forSelectedMonth": "July, 2021"}, "enrolmentActive": 1}], "enrolmentsCount": 1}, {"sid": 49, "lastName": "Measey", "firstName": "Eb", "enrolments": null, "enrolmentsCount": 0}, {"sid": 93, "lastName": "Tobester", "firstName": "Darelle", "enrolments": null, "enrolmentsCount": 0}, {"sid": 251, "lastName": "Zelvis", "firstName": "Tobias", "enrolments": [{"dropDate": null, "startDate": "2021-06-13", "enrolmentId": 4118, "classDetails": {"day": 6, "times": {"endTimeDecimal": 10.50, "endTimeDisplay": "10:30 AM", "startTimeDecimal": 10.00, "startTimeDisplay": "10:00 AM"}, "classId": 518, "baseRate": 18.8850, "classType": "Learn to Swim", "instructor": "John Z.", "classIsActive": 1, "maxEnrolments": 4}, "classMeetings": {"daysMeeting": 4, "forSelectedMonth": "July, 2021"}, "enrolmentActive": 1}], "enrolmentsCount": 1}, {"sid": 14939, "lastName": "Nelson", "firstName": "Willy", "enrolments": [{"dropDate": null, "startDate": "2021-06-06", "enrolmentId": 4115, "classDetails": {"day": 6, "times": {"endTimeDecimal": 21.00, "endTimeDisplay": "9:00 PM", "startTimeDecimal": 20.00, "startTimeDisplay": "8:00 PM"}, "classId": 522, "baseRate": 16.6500, "classType": "Squads", "instructor": "John Z.", "classIsActive": 1, "maxEnrolments": 10}, "classMeetings": {"daysMeeting": 4, "forSelectedMonth": "July, 2021"}, "enrolmentActive": 1}, {"dropDate": null, "startDate": "2021-06-20", "enrolmentId": 4116, "classDetails": {"day": 6, "times": {"endTimeDecimal": 10.50, "endTimeDisplay": "10:30 AM", "startTimeDecimal": 10.00, "startTimeDisplay": "10:00 AM"}, "classId": 518, "baseRate": 18.8850, "classType": "Learn to Swim", "instructor": "John Z.", "classIsActive": 1, "maxEnrolments": 4}, "classMeetings": {"daysMeeting": 4, "forSelectedMonth": "July, 2021"}, "enrolmentActive": 1}], "enrolmentsCount": 2}];
let tfc = {}, cb = {}, sname;

for(let s of tcstudents) {
    sid = s.sid;
    var enrolments = getEnrolmentsDetails(s);
    cb[sid] = { "enrolments": enrolments}
}
var sorted = Object.entries(cb).sort((a,b)=> {
    return a.priceTotal - b.priceTotal;
});
console.log(sorted);
sorted.forEach((e) => {
    console.log(`${e[1].enrolments.priceTotal}`)
});


function getEnrolmentsDetails(s) {
    let ecount = s.enrolments || null;
    let rawpriceArr = [];
    var tc = 0;
    if(ecount) {        
        for(e of ecount) {
            let br = e.classDetails.baseRate;
            let cm = e.classMeetings.daysMeeting;
            let p = br * cm;
            let classid = e.classDetails.classId;
            tc = tc + p;
            console.log(p);
            rawpriceArr.push({"eid": e.enrolmentId, "classid": classid, "cost" : (p)});
        }
    }
    return {"details": rawpriceArr, "priceTotal": tc};
}