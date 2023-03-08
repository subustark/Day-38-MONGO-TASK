// 1.To create Database
//use zenclass

//inserting users


db.users.insertMany([
    {
        userid:1,
        name:"shyam",
        email:"shyamsj@gmail.com",
    },
     {
        userid:2,
        name:"lokesh",
        email:"lokesh77@gmail.com",
    },
     {
        userid:3,
        name:"Rakesh",
        email:"Rakeshmaya@gmail.com",
    },
     {
        userid:4,
        name:"Dilip",
        email:"dilip009@gmail.com",
    },
     {
        userid:5,
        name:"raghu",
        email:"raghuash33@gmail.com",
    }
    
    ])



   //codekata
db.codekata.insertMany([
    {
        userid:1,
        problems:40
    },
     {
        userid:2,
        problems:17
    },
     {
        userid:3,
        problems:42
    },
     {
        userid:4,
        problems:22
    },
     {
        userid:5,
        problems:33
    }
    ])  
    
 //topics

db.topics.insertMany([
    {   
        topicid:1,
        topic:"html",
        topic_date:new Date("07-oct-2020")
    },
     {
         topicid:2,
        topic:"css",
        topic_date:new Date("15-oct-2020")
    },
     {
         topicid:3,
        topic:"Javascript",
        topic_date:new Date("18-oct-2020")
    },
     {
         topicid:4,
        topic:"React",
        topic_date:new Date("24-oct-2020")
    },
     {
         topicid:5,
        topic:"NodeJs",
        topic_date:new Date("29-oct-2020")
    }
    ])
    
//tasks

db.tasks.insertMany([
    {
        taskid:1,
        topicid:1,
        userid:1,
        task:"html task",
        due_date:new Date("07-oct-2020"),
        submitted:true
    },
    {
        taskid:2,
        topicid:2,
        userid:2,
        task:"css task",
        due_date:new Date("15-oct-2020"),
        submitted:true
    },
     {
        taskid:3,
        topicid:3,
        userid:3,
        task:"Javascript task",
        due_date:new Date("18-oct-2020"),
        submitted:false
    },
      {
        taskid:4,
        topicid:4,
        userid:4,
        task:"React task",
        due_date:new Date("24-oct-2020"),
        submitted:false
    },
     {
        taskid:5,
        topicid:5,
        userid:5,
        task:"Node task",
        due_date:new Date("29-oct-2020"),
        submitted:false
    }
    ])
//attendance

db.attendance.insertMany([
    {
        userid:1,
        topicid:1,
        attended:true
    },
     {
        userid:2,
        topicid:2,
        attended:true
    },
     {
        userid:3,
        topicid:3,
        attended:true
    },
    {
        userid:4,
        topicid:4,
        attended:false
    },
    {
        userid:5,
        topicid:5,
        attended:true
    }
    
    ])
    
 
//mentors

db.mentors.insertMany([
    {
        mentorid:1,
        mentorname:"deepak",
        mentor_email:"deepak57@gmail.com"
    },
      {
        mentorid:2,
        mentorname:"vishnu",
        mentor_email:"vishnuvaalu07@gmail.com"
    },
      {
        mentorid:3,
        mentorname:"siva",
        mentor_email:"siva54@gmail.com"
    },
      {
        mentorid:4,
        mentorname:"vinoth",
        mentor_email:"vinoth989@gmail.com"
    },
      {
        mentorid:5,
        mentorname:"lokesh",
        mentor_email:"lokesh33@gmail.com"
    }
    ])
    

// company drives

db.comapnydrives.insertMany([
    {
        userid:1,
        drive_date:new Date("09-oct-2020"),
        company:"Google"
    },
     {
        userid:1,
        drive_date:new Date("10-oct-2020"),
        company:"Amazon"
    },
     {
        userid:2,
        drive_date:new Date("17-oct-2020"),
        company:"Flipkart"
    },
     {
        userid:3,
        drive_date:new Date("22-oct-2020"),
        company:"Zoho"
    },
     {
        userid:4,
        drive_date:new Date("25-oct-2020"),
        company:"Freshworks"
    }
    ])


 //Find all the topics and tasks which are thought in the month of October

db.topics.aggregate([
    {
        $lookup: {
               from: "tasks",
               localField: "topicid",
               foreignField: "topicid",
               as: "taskinfo"
             }
    },
    {
        $match:{$and:[{$or:[{topic_date:{$gt:new Date("30-sep-2020")}},{topic_date:{$lt:new Date("1-nov-2020")}}]},
        
          {$or:[{"taskinfo.due_date":{$gt:new Date("30-sep-2020")}},{"taskinfo.due_date":{$lt:new Date("1-nov-2020")}}]}
        ]}
    }
    
    ])



//Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.comapnydrives.find({$or:[{drive_date:{$gte:new Date("15-oct-2020")}},
{drive_date:{$lte:new Date("31-0ct-2020")}}]})

// Find all the company drives and students who are appeared for the placement.

db.comapnydrives.aggregate([
    {
        $lookup: {
              from:"users",
              localField:"userid",
              foreignField:"userid",
              as :"userinfo"
             }
    },
    {
        $project:{
            _id:0,
            "userinfo.name":1,
            company:1,
            drive_date:1,
            "userinfo.email":1,
            "userinfo.userid":1
        }
    }
    ])


/*Find the number of problems solved by the user in codekata*/

db.codekata.aggregate([
    {
        $lookup: {
               from: "users",
               localField: "userid",
               foreignField: "userid",
               as: "userinfo"
             }
    },
    {
        $project:{
            _id:0,userid:1,problems:1,"userinfo.name":1
        }
    }
    ])
   

 //Find all the mentors with who has the mentee's count more than 15

db.users.aggregate([
   {$lookup: {
          from: "mentors",
          localField: "mentorid",
          foreignField: "mentorid",
          as: "mentorInfo"
        }},
   {$group:{_id:{mentorid:"$mentorInfo.mentorid",mentorname:"$mentorInfo.mentorname"},mentee_count:{$sum:1}}},
   {$match:{mentee_count:{$gt:15}}},
   
   ])


//Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020


db.attendance.aggregate([
    {$lookup: {
           from: "topics",
           localField: "topicid",
           foreignField: "topicid",
           as: "topics"
         }},
         {
             $lookup: {
                    from: "tasks",
                    localField: "topicid",
                    foreignField: "topicid",
                    as: "tasks"
                  }
         },
         {$match:{$and:[{attended:false},{"tasks.submitted":false}]}},
         {$match:{$and:[{$or:[{"topics.topic_date":{$gte:new Date("15-oct-2020")}},{"topics.topic_date":{$lte:new Date("31-oct-2020")}}]}, 
         {$or:[{"tasks.due_date":{$gte:new Date("15-oct-2020")}},{"tasks.due_date":{$lte:new Date("31-oct-2020")}}]}
         ]}},
         {
             $count: "No_of_students_absent"
         }
         
    ])