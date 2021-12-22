dmx.config({
  "familyDetail": {
    "query": [
      {
        "type": "text",
        "name": "familyid"
      }
    ]
  },
  "familydetail": {
    "query": [
      {
        "type": "text",
        "name": "studentid"
      },
      {
        "type": "number",
        "name": "noteid"
      },
      {
        "type": "number",
        "name": "familynoteid"
      },
      {
        "type": "text",
        "name": "familyid"
      }
    ],
    "data_detail1": {
      "meta": [
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "phone",
          "type": "text"
        },
        {
          "name": "email",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "text"
        },
        {
          "name": "id",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "isPrimaryGuardian": {
      "meta": null,
      "outputType": "text"
    },
    "age": {
      "outputType": "text"
    },
    "editStudentDataDetail": {
      "meta": [
        {
          "name": "query",
          "type": "array",
          "sub": [
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "dob",
              "type": "date"
            },
            {
              "name": "rollSheetComments",
              "type": "text"
            },
            {
              "name": "rollSheetMedical",
              "type": "text"
            },
            {
              "name": "additionalMedical",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            },
            {
              "name": "name",
              "type": "text"
            },
            {
              "name": "gender",
              "type": "text"
            },
            {
              "name": "level",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "object"
    },
    "var1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "student",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "data_detail2": {
      "meta": null,
      "outputType": "object"
    },
    "tableRepeat3": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "student",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "tableRepeat4": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "student",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "tableRepeat2": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "date"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        },
        {
          "name": "age",
          "type": "text"
        },
        {
          "name": "getStudentNotes",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "content",
              "type": "text"
            },
            {
              "name": "student",
              "type": "text"
            },
            {
              "name": "priority",
              "type": "number"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "repeat1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "date"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        },
        {
          "name": "age",
          "type": "text"
        },
        {
          "name": "getStudentNotes",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "content",
              "type": "text"
            },
            {
              "name": "student",
              "type": "text"
            },
            {
              "name": "priority",
              "type": "number"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "studentNotesRepeat": {
      "meta": [
        {
          "name": "COUNT(*)",
          "type": "number"
        },
        {
          "name": "priority",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "noteDataDetail": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "student",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        }
      ],
      "outputType": "object"
    },
    "familyNotesRepeater": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        },
        {
          "name": "family",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "masonry1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        },
        {
          "name": "family",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "editFamilyNoteDetail": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "subject",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "repeat2": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "priority",
          "type": "number"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "subject",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "topPriorityNotes": {
      "meta": null,
      "outputType": "number"
    }
  },
  "students": {
    "query": [
      {
        "type": "text",
        "name": "offset"
      },
      {
        "type": "text",
        "name": "sort"
      },
      {
        "type": "text",
        "name": "dir"
      },
      {
        "type": "text",
        "name": "textfilter"
      },
      {
        "type": "array",
        "name": "levelsfilter"
      },
      {
        "type": "text",
        "name": "limit"
      }
    ],
    "repeatStudents": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "date"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "repeat1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "date"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "levelsRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "isValid",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "levelsinarray": {
      "meta": null,
      "outputType": "array"
    },
    "levelsInArray": {
      "meta": null,
      "outputType": "array"
    },
    "repeat2": {
      "meta": null,
      "outputType": "array"
    },
    "repeat3": {
      "meta": [
        {
          "name": "selectAllStudents",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "dob",
              "type": "date"
            },
            {
              "name": "rollSheetComments",
              "type": "text"
            },
            {
              "name": "rollSheetMedical",
              "type": "text"
            },
            {
              "name": "additionalMedical",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            },
            {
              "name": "gender",
              "type": "text"
            },
            {
              "name": "level",
              "type": "text"
            },
            {
              "name": "level_id",
              "type": "text"
            },
            {
              "name": "level_name",
              "type": "text"
            },
            {
              "name": "level_isvalid",
              "type": "number"
            }
          ]
        }
      ],
      "outputType": "object"
    },
    "studentsrepeat": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "date"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        },
        {
          "name": "level_id",
          "type": "text"
        },
        {
          "name": "level_name",
          "type": "text"
        },
        {
          "name": "level_isvalid",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "tableRepeat2": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "date"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "number"
        },
        {
          "name": "age",
          "type": "text"
        },
        {
          "name": "fullname",
          "type": "text"
        }
      ],
      "outputType": "array"
    }
  },
  "editStudent": {
    "query": [
      {
        "type": "text",
        "name": "studentid"
      }
    ]
  },
  "studentDetail": {
    "data_detail1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "date"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        }
      ],
      "outputType": "object"
    },
    "query": [
      {
        "type": "number",
        "name": "studentid"
      }
    ]
  },
  "families": {
    "guardianTempStore": [
      {
        "type": "text",
        "name": "firstName"
      },
      {
        "type": "text",
        "name": "lastName"
      },
      {
        "type": "text",
        "name": "email"
      },
      {
        "type": "text",
        "name": "phone"
      },
      {
        "type": "number",
        "name": "relationship"
      }
    ],
    "tableRepeat3": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "firstName"
        },
        {
          "type": "text",
          "name": "lastName"
        },
        {
          "type": "text",
          "name": "email"
        },
        {
          "type": "text",
          "name": "phone"
        },
        {
          "type": "number",
          "name": "relationship"
        }
      ],
      "outputType": "array"
    },
    "query": [
      {
        "type": "text",
        "name": "sort"
      },
      {
        "type": "text",
        "name": "dir"
      },
      {
        "type": "text",
        "name": "textfilter"
      },
      {
        "type": "text",
        "name": "offset"
      },
      {
        "type": "text",
        "name": "limit"
      },
      {
        "type": "text",
        "name": "hello"
      }
    ],
    "tableRepeat1": {
      "meta": [
        {
          "name": "primaryGuardian",
          "type": "number"
        },
        {
          "name": "guardian",
          "type": "text"
        },
        {
          "name": "phoneNumbers",
          "type": "text"
        },
        {
          "name": "emails",
          "type": "text"
        },
        {
          "name": "students",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "sessionStorage": [
      {
        "type": "text",
        "name": "textsearch"
      }
    ],
    "phone_holding": [
      {
        "type": "text",
        "name": "phone"
      },
      {
        "type": "text",
        "name": "type"
      }
    ],
    "email_holding": [
      {
        "type": "text",
        "name": "address"
      },
      {
        "type": "text",
        "name": "type"
      }
    ],
    "guard_datastore": [
      {
        "type": "text",
        "name": "firstname"
      },
      {
        "type": "text",
        "name": "lastname"
      },
      {
        "type": "number",
        "name": "relationship"
      },
      {
        "type": "array",
        "name": "phones"
      },
      {
        "type": "array",
        "name": "emails"
      }
    ],
    "validateGuardians": [
      {
        "name": "$param",
        "type": "object",
        "sub": [
          {
            "type": "text",
            "name": "isupdate"
          },
          {
            "type": "number",
            "name": "id"
          }
        ]
      },
      {
        "name": "var_flow",
        "type": "text"
      },
      {
        "name": "var_flow",
        "type": "text"
      },
      {
        "name": "var_flow",
        "type": "text"
      },
      {
        "name": "var_flow",
        "type": "text"
      },
      {
        "name": "var_id",
        "type": "text"
      }
    ],
    "var_guardianFormValid": {
      "meta": null,
      "outputType": "boolean"
    },
    "phonesrepeat": {
      "meta": null,
      "outputType": "array"
    },
    "check_newFamilyEmails": [
      {
        "name": "$param",
        "type": "object",
        "sub": [
          {
            "type": "text",
            "name": "address"
          }
        ]
      },
      {
        "name": "var_error",
        "type": "text"
      },
      {
        "name": "var_emails",
        "type": "text"
      },
      {
        "name": "var_error",
        "type": "text"
      },
      {
        "name": "checkFamilyEmails",
        "type": "array",
        "sub": [
          {
            "name": "$index",
            "type": "number"
          },
          {
            "name": "$number",
            "type": "number"
          },
          {
            "name": "$name",
            "type": "text"
          },
          {
            "name": "$value",
            "type": "object"
          }
        ]
      }
    ],
    "repeat_guardians": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "firstname"
        },
        {
          "type": "text",
          "name": "lastname"
        },
        {
          "type": "number",
          "name": "relationship"
        },
        {
          "type": "array",
          "name": "phones"
        },
        {
          "type": "array",
          "name": "emails"
        },
        {
          "type": "text",
          "name": "rstring"
        }
      ],
      "outputType": "array"
    },
    "emails": {
      "meta": null,
      "outputType": "array"
    }
  },
  "index layoutMain": {
    "guardians": {
      "meta": null,
      "outputType": "object"
    },
    "repeat1": {
      "meta": [
        {
          "name": "students",
          "type": "text"
        },
        {
          "name": "primaryGuardian",
          "type": "text"
        },
        {
          "name": "street1",
          "type": "text"
        },
        {
          "name": "street2",
          "type": "text"
        },
        {
          "name": "suburb",
          "type": "text"
        },
        {
          "name": "state",
          "type": "text"
        },
        {
          "name": "id",
          "type": "text"
        }
      ],
      "outputType": "object"
    },
    "sessionStorage": [
      {
        "type": "array",
        "name": "guardianTempStorage",
        "sub": [
          {
            "type": "object",
            "name": "guardian",
            "sub": [
              {
                "type": "text",
                "name": "firstName"
              },
              {
                "type": "text",
                "name": "lastName"
              },
              {
                "type": "text",
                "name": "phone"
              },
              {
                "type": "text",
                "name": "email"
              }
            ]
          }
        ]
      }
    ],
    "datastore1": [
      {
        "type": "text",
        "name": "firstName"
      },
      {
        "type": "text",
        "name": "lastName"
      },
      {
        "type": "text",
        "name": "phone"
      },
      {
        "type": "text",
        "name": "email"
      },
      {
        "type": "number",
        "name": "relationship"
      }
    ],
    "localStorage": [
      {
        "type": "array",
        "name": "guardians",
        "sub": [
          {
            "type": "text",
            "name": "firstName"
          },
          {
            "type": "text",
            "name": "lastName"
          }
        ]
      }
    ],
    "repeatGuardianInputs": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "firstName"
        },
        {
          "type": "text",
          "name": "lastName"
        },
        {
          "type": "text",
          "name": "phone"
        },
        {
          "type": "text",
          "name": "email"
        },
        {
          "type": "number",
          "name": "relationship"
        }
      ],
      "outputType": "array"
    },
    "query": [
      {
        "type": "text",
        "name": "familyid"
      }
    ],
    "familyMasonryRepeat": {
      "meta": [
        {
          "name": "familyDetails",
          "type": "object",
          "sub": [
            {
              "name": "$index",
              "type": "number"
            },
            {
              "name": "students",
              "type": "text"
            },
            {
              "name": "primaryGuardian",
              "type": "text"
            },
            {
              "name": "street1",
              "type": "text"
            },
            {
              "name": "street2",
              "type": "text"
            },
            {
              "name": "suburb",
              "type": "text"
            },
            {
              "name": "state",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            }
          ]
        },
        {
          "name": "getAllGuardians",
          "type": "array",
          "sub": [
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "email",
              "type": "text"
            },
            {
              "name": "relationship",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            }
          ]
        },
        {
          "name": "primaryGuardian",
          "type": "object",
          "sub": [
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "email",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "relationship",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "object"
    },
    "masonry1": {
      "meta": [
        {
          "name": "familyDetails",
          "type": "object",
          "sub": [
            {
              "name": "students",
              "type": "text"
            },
            {
              "name": "primaryGuardian",
              "type": "text"
            },
            {
              "name": "street1",
              "type": "text"
            },
            {
              "name": "street2",
              "type": "text"
            },
            {
              "name": "suburb",
              "type": "text"
            },
            {
              "name": "state",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            }
          ]
        },
        {
          "name": "getAllGuardians",
          "type": "array",
          "sub": [
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "email",
              "type": "text"
            },
            {
              "name": "relationship",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            }
          ]
        },
        {
          "name": "primaryGuardian",
          "type": "object",
          "sub": [
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "email",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "relationship",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "object"
    }
  },
  "standardHeaderFooter": {
    "query": [
      {
        "type": "text",
        "name": "sort"
      },
      {
        "type": "text",
        "name": "dir"
      },
      {
        "type": "text",
        "name": "limit"
      },
      {
        "type": "text",
        "name": "textfilter"
      },
      {
        "type": "text",
        "name": "offset"
      },
      {
        "type": "text",
        "name": "searchtextfilter"
      },
      {
        "type": "text",
        "name": "familyid"
      },
      {
        "type": "text",
        "name": "studentid"
      },
      {
        "type": "text",
        "name": "uuid"
      }
    ],
    "tableRepeat1": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "text"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "number"
        },
        {
          "name": "age",
          "type": "text"
        },
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "guardianFName",
          "type": "text"
        },
        {
          "name": "guardianLName",
          "type": "text"
        },
        {
          "name": "levelName",
          "type": "text"
        },
        {
          "name": "familyId",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "sessionStorage": [
      {
        "type": "text",
        "name": "username"
      }
    ],
    "rp_studentFamiliesList_search": {
      "meta": [
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "students",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "dob",
              "type": "text"
            },
            {
              "name": "rollSheetComments",
              "type": "text"
            },
            {
              "name": "rollSheetMedical",
              "type": "text"
            },
            {
              "name": "additionalMedical",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            },
            {
              "name": "gender",
              "type": "text"
            },
            {
              "name": "level",
              "type": "number"
            },
            {
              "name": "age",
              "type": "text"
            },
            {
              "name": "score",
              "type": "number"
            },
            {
              "name": "guardianFName",
              "type": "text"
            },
            {
              "name": "guardianLName",
              "type": "text"
            },
            {
              "name": "levelName",
              "type": "text"
            },
            {
              "name": "familyId",
              "type": "text"
            }
          ]
        },
        {
          "name": "guardians",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            },
            {
              "name": "relationship",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "studentRepeat_search": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "text"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "number"
        },
        {
          "name": "age",
          "type": "text"
        },
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "guardianFName",
          "type": "text"
        },
        {
          "name": "guardianLName",
          "type": "text"
        },
        {
          "name": "levelName",
          "type": "text"
        },
        {
          "name": "familyId",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "var1": {
      "outputType": "number"
    },
    "guardianNameRepeat": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "repeat1": {
      "meta": [
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "students",
          "type": "array",
          "sub": [
            {
              "name": "score",
              "type": "number"
            },
            {
              "name": "max_score",
              "type": "number"
            },
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "level",
              "type": "text"
            },
            {
              "name": "family",
              "type": "number"
            },
            {
              "name": "gender",
              "type": "text"
            },
            {
              "name": "dob",
              "type": "text"
            },
            {
              "name": "rollSheetComments",
              "type": "text"
            },
            {
              "name": "rollSheetMedical",
              "type": "text"
            },
            {
              "name": "additionalMedical",
              "type": "text"
            },
            {
              "name": "age",
              "type": "text"
            }
          ]
        },
        {
          "name": "guardians",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            },
            {
              "name": "relationship",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "repeat2": {
      "meta": [
        {
          "name": "score",
          "type": "number"
        },
        {
          "name": "max_score",
          "type": "number"
        },
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "text"
        },
        {
          "name": "rollSheetComments",
          "type": "text"
        },
        {
          "name": "rollSheetMedical",
          "type": "text"
        },
        {
          "name": "additionalMedical",
          "type": "text"
        },
        {
          "name": "age",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "var_maxValue": {
      "outputType": "number"
    },
    "var_studentRelevance": {
      "meta": null,
      "outputType": "number"
    },
    "global": [
      {
        "type": "boolean",
        "name": "navbarToggle"
      }
    ],
    "cookies": [
      {
        "type": "boolean",
        "name": "navbarToggle"
      }
    ]
  },
  "familyDetails": {
    "guardianDatastore": [
      {
        "type": "text",
        "name": "firstName"
      },
      {
        "type": "text",
        "name": "lastName"
      },
      {
        "type": "text",
        "name": "phone"
      },
      {
        "type": "text",
        "name": "email"
      },
      {
        "type": "text",
        "name": "relationship"
      },
      {
        "type": "text",
        "name": "relationshipName"
      },
      {
        "type": "boolean",
        "name": "isPrimary"
      }
    ],
    "fl_findRelationshipName": [
      {
        "name": "relationshipTypeName",
        "type": "text"
      },
      {
        "name": "repeat",
        "type": "array",
        "sub": [
          {
            "name": "$index",
            "type": "number"
          },
          {
            "name": "$number",
            "type": "number"
          },
          {
            "name": "$name",
            "type": "text"
          },
          {
            "name": "$value",
            "type": "object"
          },
          {
            "name": "id",
            "type": "text"
          },
          {
            "name": "type",
            "type": "text"
          }
        ]
      }
    ],
    "fl_getRelationshipName": [
      {
        "name": "rp_getRelationshipName",
        "type": "array",
        "sub": [
          {
            "name": "$index",
            "type": "number"
          },
          {
            "name": "$number",
            "type": "number"
          },
          {
            "name": "$name",
            "type": "text"
          },
          {
            "name": "$value",
            "type": "object"
          }
        ]
      }
    ],
    "dv_relationshipName": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "dd_relationshipName": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "studentDatastore": [
      {
        "type": "text",
        "name": "firstName"
      },
      {
        "type": "text",
        "name": "lastName"
      },
      {
        "type": "text",
        "name": "dob"
      },
      {
        "type": "text",
        "name": "level"
      },
      {
        "type": "text",
        "name": "levelname"
      }
    ],
    "tableRepeat1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "startofweek",
          "type": "date"
        },
        {
          "name": "classId",
          "type": "number"
        },
        {
          "name": "studentid",
          "type": "number"
        },
        {
          "name": "classTypeId",
          "type": "number"
        },
        {
          "name": "enrolid",
          "type": "number"
        },
        {
          "name": "classDate",
          "type": "date"
        },
        {
          "name": "enrolCount",
          "type": "text"
        },
        {
          "name": "baseRate",
          "type": "number"
        },
        {
          "name": "discAmt",
          "type": "number"
        },
        {
          "name": "netAmt",
          "type": "number"
        },
        {
          "name": "enrolNumber",
          "type": "number"
        },
        {
          "name": "discType",
          "type": "text"
        },
        {
          "name": "discVal",
          "type": "number"
        },
        {
          "name": "_procedure",
          "type": "text"
        },
        {
          "name": "fd_sum_before",
          "type": "number"
        },
        {
          "name": "fd_type",
          "type": "text"
        },
        {
          "name": "fd_value",
          "type": "number"
        },
        {
          "name": "fd_amt",
          "type": "number"
        },
        {
          "name": "fd_procedure",
          "type": "text"
        },
        {
          "name": "netAmt_total",
          "type": "number"
        },
        {
          "name": "enr_grandTotal",
          "type": "number"
        },
        {
          "name": "net_grandTotal",
          "type": "number"
        },
        {
          "name": "discDir",
          "type": "text"
        },
        {
          "name": "chargeId",
          "type": "text"
        },
        {
          "name": "lineInvNumber",
          "type": "text"
        },
        {
          "name": "status",
          "type": "text"
        },
        {
          "name": "classInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "startTimeDecimal",
              "type": "number"
            },
            {
              "name": "endTimeDecimal",
              "type": "number"
            },
            {
              "name": "isactive",
              "type": "boolean"
            },
            {
              "name": "instructor",
              "type": "text"
            },
            {
              "name": "classLevel",
              "type": "text"
            },
            {
              "name": "day",
              "type": "text"
            },
            {
              "name": "startTimeDisplay",
              "type": "text"
            },
            {
              "name": "endTimeDisplay",
              "type": "text"
            },
            {
              "name": "max",
              "type": "number"
            },
            {
              "name": "classType",
              "type": "number"
            },
            {
              "name": "enrolCount",
              "type": "number"
            },
            {
              "name": "actEnr",
              "type": "number"
            },
            {
              "name": "muEnr",
              "type": "number"
            },
            {
              "name": "trEnr",
              "type": "number"
            },
            {
              "name": "waEnr",
              "type": "number"
            },
            {
              "name": "dayname",
              "type": "text"
            },
            {
              "name": "instructorFirst",
              "type": "text"
            },
            {
              "name": "instructorLast",
              "type": "text"
            }
          ]
        },
        {
          "name": "instructorInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "email",
              "type": "text"
            },
            {
              "name": "staffTypes",
              "type": "text"
            }
          ]
        },
        {
          "name": "classLevel",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "name",
              "type": "text"
            },
            {
              "name": "isValid",
              "type": "boolean"
            },
            {
              "name": "colour",
              "type": "text"
            },
            {
              "name": "order",
              "type": "number"
            },
            {
              "name": "classType",
              "type": "text"
            }
          ]
        },
        {
          "name": "studentInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "dob",
              "type": "date"
            },
            {
              "name": "rollSheetComments",
              "type": "text"
            },
            {
              "name": "rollSheetMedical",
              "type": "text"
            },
            {
              "name": "additionalMedical",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            },
            {
              "name": "gender",
              "type": "text"
            },
            {
              "name": "level",
              "type": "text"
            },
            {
              "name": "age",
              "type": "text"
            }
          ]
        },
        {
          "name": "enrolmentInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "enrolmentType",
              "type": "number"
            },
            {
              "name": "dropDate",
              "type": "date"
            },
            {
              "name": "isValid",
              "type": "boolean"
            },
            {
              "name": "student",
              "type": "text"
            },
            {
              "name": "startDate",
              "type": "date"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "dropReason",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "query": [
      {
        "type": "text",
        "name": "familyid"
      }
    ],
    "rp_phoneNumbers": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "phone",
          "type": "text"
        },
        {
          "name": "guardianId",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "dd_guardianPhone": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "primaryGuardian",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "phoneNumbers",
          "type": "text"
        },
        {
          "name": "emailAddresses",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "dd_guardianPhoneEditDetails": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "phone",
          "type": "text"
        },
        {
          "name": "guardianId",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "rp_editPhoneNumbers": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "phone",
          "type": "text"
        },
        {
          "name": "guardianId",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "var_originalPhone": {
      "meta": null,
      "outputType": "text"
    },
    "var_originalType": {
      "meta": null,
      "outputType": "number"
    },
    "rp_editEmailss": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "address",
          "type": "text"
        },
        {
          "name": "guardianId",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "var_emailIsSame": {
      "meta": null,
      "outputType": "text"
    },
    "var_originalEmail": {
      "meta": null,
      "outputType": "text"
    },
    "getRelationshipName": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "data_detail1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "guardianRepeat": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "primaryGuardian",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "number"
        },
        {
          "name": "phoneNumbers",
          "type": "text",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "guardianId",
              "type": "text"
            },
            {
              "name": "type",
              "type": "text"
            }
          ]
        },
        {
          "name": "emailAddresses",
          "type": "text",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "address",
              "type": "text"
            },
            {
              "name": "guardianId",
              "type": "text"
            },
            {
              "name": "type",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "studentRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstname",
          "type": "text"
        },
        {
          "name": "lastname",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "text"
        },
        {
          "name": "age",
          "type": "text"
        },
        {
          "name": "rollsheetcomments",
          "type": "text"
        },
        {
          "name": "rollsheetmedical",
          "type": "text"
        },
        {
          "name": "additionalmedical",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "gender",
          "type": "text"
        },
        {
          "name": "level",
          "type": "number"
        },
        {
          "name": "getStudentNotes",
          "type": "array",
          "sub": [
            {
              "name": "priority",
              "type": "number"
            },
            {
              "name": "content",
              "type": "text"
            },
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "student",
              "type": "text"
            },
            {
              "name": "subject",
              "type": "text"
            }
          ]
        },
        {
          "name": "groupedPriorities",
          "type": "array",
          "sub": [
            {
              "name": "COUNT(*)",
              "type": "number"
            },
            {
              "name": "priority",
              "type": "number"
            },
            {
              "name": "priority_name",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "guardianDetail": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "primaryGuardian",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "number"
        },
        {
          "name": "phoneNumbers",
          "type": "text"
        },
        {
          "name": "emailAddresses",
          "type": "text"
        },
        {
          "name": "phoneNumbersArray",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "guardianId",
              "type": "text"
            },
            {
              "name": "type",
              "type": "text"
            }
          ]
        },
        {
          "name": "emailAddressesArray",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "address",
              "type": "text"
            },
            {
              "name": "guardianId",
              "type": "text"
            },
            {
              "name": "type",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "rp_editEmails": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "address",
          "type": "text"
        },
        {
          "name": "guardianId",
          "type": "text"
        },
        {
          "name": "type",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "familychargeRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "date"
        },
        {
          "name": "chargeDateFrom",
          "type": "date"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "date"
        },
        {
          "name": "getEnrolmentChargeIds",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "allEnrolmentCharges",
              "type": "array",
              "sub": [
                {
                  "name": "enrolid",
                  "type": "number"
                },
                {
                  "name": "startDate",
                  "type": "date"
                },
                {
                  "name": "dropDate",
                  "type": "date"
                },
                {
                  "name": "enrolmentCharges",
                  "type": "array",
                  "sub": [
                    {
                      "name": "id",
                      "type": "text"
                    },
                    {
                      "name": "startofweek",
                      "type": "date"
                    },
                    {
                      "name": "classId",
                      "type": "number"
                    },
                    {
                      "name": "studentid",
                      "type": "number"
                    },
                    {
                      "name": "classTypeId",
                      "type": "number"
                    },
                    {
                      "name": "enrolid",
                      "type": "number"
                    },
                    {
                      "name": "classDate",
                      "type": "date"
                    },
                    {
                      "name": "enrolCount",
                      "type": "text"
                    },
                    {
                      "name": "baseRate",
                      "type": "number"
                    },
                    {
                      "name": "discAmt",
                      "type": "number"
                    },
                    {
                      "name": "netAmt",
                      "type": "number"
                    },
                    {
                      "name": "enrolNumber",
                      "type": "number"
                    },
                    {
                      "name": "discType",
                      "type": "text"
                    },
                    {
                      "name": "discVal",
                      "type": "number"
                    },
                    {
                      "name": "_procedure",
                      "type": "text"
                    },
                    {
                      "name": "fd_sum_before",
                      "type": "number"
                    },
                    {
                      "name": "fd_type",
                      "type": "text"
                    },
                    {
                      "name": "fd_value",
                      "type": "number"
                    },
                    {
                      "name": "fd_amt",
                      "type": "number"
                    },
                    {
                      "name": "fd_procedure",
                      "type": "text"
                    },
                    {
                      "name": "netAmt_total",
                      "type": "number"
                    },
                    {
                      "name": "enr_grandTotal",
                      "type": "number"
                    },
                    {
                      "name": "net_grandTotal",
                      "type": "number"
                    },
                    {
                      "name": "discDir",
                      "type": "text"
                    },
                    {
                      "name": "chargeId",
                      "type": "text"
                    },
                    {
                      "name": "lineInvNumber",
                      "type": "text"
                    },
                    {
                      "name": "status",
                      "type": "text"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "chargeStudents": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "enrolmentsCount",
          "type": "number"
        },
        {
          "name": "enrolmentsTotal",
          "type": "number"
        },
        {
          "name": "allEnrolmentCharges",
          "type": "array",
          "sub": [
            {
              "name": "classTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "startDate",
              "type": "date"
            },
            {
              "name": "dropDate",
              "type": "date"
            },
            {
              "name": "classStartTime",
              "type": "text"
            },
            {
              "name": "classEndTime",
              "type": "text"
            },
            {
              "name": "classLevelName",
              "type": "text"
            },
            {
              "name": "classDay",
              "type": "text"
            },
            {
              "name": "instructorFirst",
              "type": "text"
            },
            {
              "name": "instructorLast",
              "type": "text"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "enrolmentCharges",
              "type": "array",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "startofweek",
                  "type": "date"
                },
                {
                  "name": "classId",
                  "type": "number"
                },
                {
                  "name": "studentid",
                  "type": "number"
                },
                {
                  "name": "classTypeId",
                  "type": "number"
                },
                {
                  "name": "enrolid",
                  "type": "number"
                },
                {
                  "name": "classDate",
                  "type": "date"
                },
                {
                  "name": "enrolCount",
                  "type": "text"
                },
                {
                  "name": "baseRate",
                  "type": "number"
                },
                {
                  "name": "discAmt",
                  "type": "number"
                },
                {
                  "name": "netAmt",
                  "type": "number"
                },
                {
                  "name": "enrolNumber",
                  "type": "number"
                },
                {
                  "name": "discType",
                  "type": "text"
                },
                {
                  "name": "discVal",
                  "type": "number"
                },
                {
                  "name": "_procedure",
                  "type": "text"
                },
                {
                  "name": "fd_sum_before",
                  "type": "number"
                },
                {
                  "name": "fd_type",
                  "type": "text"
                },
                {
                  "name": "fd_value",
                  "type": "number"
                },
                {
                  "name": "fd_amt",
                  "type": "number"
                },
                {
                  "name": "fd_procedure",
                  "type": "text"
                },
                {
                  "name": "netAmt_total",
                  "type": "number"
                },
                {
                  "name": "enr_grandTotal",
                  "type": "number"
                },
                {
                  "name": "net_grandTotal",
                  "type": "number"
                },
                {
                  "name": "discDir",
                  "type": "text"
                },
                {
                  "name": "chargeId",
                  "type": "text"
                },
                {
                  "name": "lineInvNumber",
                  "type": "text"
                },
                {
                  "name": "status",
                  "type": "text"
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "repeatfamilycharges": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "date"
        },
        {
          "name": "chargeDateFrom",
          "type": "date"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "date"
        }
      ],
      "outputType": "array"
    },
    "repeat1": {
      "meta": null,
      "outputType": "array"
    },
    "familyChargesRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "date"
        },
        {
          "name": "chargeDateFrom",
          "type": "date"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "date"
        },
        {
          "name": "getEnrolmentChargeIds",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "allEnrolmentCharges",
              "type": "array",
              "sub": [
                {
                  "name": "enrolid",
                  "type": "number"
                },
                {
                  "name": "startDate",
                  "type": "date"
                },
                {
                  "name": "dropDate",
                  "type": "date"
                },
                {
                  "name": "enrolmentCharges",
                  "type": "array",
                  "sub": [
                    {
                      "name": "id",
                      "type": "text"
                    },
                    {
                      "name": "startofweek",
                      "type": "date"
                    },
                    {
                      "name": "classId",
                      "type": "number"
                    },
                    {
                      "name": "studentid",
                      "type": "number"
                    },
                    {
                      "name": "classTypeId",
                      "type": "number"
                    },
                    {
                      "name": "enrolid",
                      "type": "number"
                    },
                    {
                      "name": "classDate",
                      "type": "date"
                    },
                    {
                      "name": "enrolCount",
                      "type": "text"
                    },
                    {
                      "name": "baseRate",
                      "type": "number"
                    },
                    {
                      "name": "discAmt",
                      "type": "number"
                    },
                    {
                      "name": "netAmt",
                      "type": "number"
                    },
                    {
                      "name": "enrolNumber",
                      "type": "number"
                    },
                    {
                      "name": "discType",
                      "type": "text"
                    },
                    {
                      "name": "discVal",
                      "type": "number"
                    },
                    {
                      "name": "_procedure",
                      "type": "text"
                    },
                    {
                      "name": "fd_sum_before",
                      "type": "number"
                    },
                    {
                      "name": "fd_type",
                      "type": "text"
                    },
                    {
                      "name": "fd_value",
                      "type": "number"
                    },
                    {
                      "name": "fd_amt",
                      "type": "number"
                    },
                    {
                      "name": "fd_procedure",
                      "type": "text"
                    },
                    {
                      "name": "netAmt_total",
                      "type": "number"
                    },
                    {
                      "name": "enr_grandTotal",
                      "type": "number"
                    },
                    {
                      "name": "net_grandTotal",
                      "type": "number"
                    },
                    {
                      "name": "discDir",
                      "type": "text"
                    },
                    {
                      "name": "chargeId",
                      "type": "text"
                    },
                    {
                      "name": "lineInvNumber",
                      "type": "text"
                    },
                    {
                      "name": "status",
                      "type": "text"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "dc_studentChargeBreakdown": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "startofweek",
          "type": "date"
        },
        {
          "name": "classId",
          "type": "number"
        },
        {
          "name": "studentid",
          "type": "number"
        },
        {
          "name": "classTypeId",
          "type": "number"
        },
        {
          "name": "enrolid",
          "type": "number"
        },
        {
          "name": "classDate",
          "type": "date"
        },
        {
          "name": "enrolCount",
          "type": "text"
        },
        {
          "name": "baseRate",
          "type": "number"
        },
        {
          "name": "discAmt",
          "type": "number"
        },
        {
          "name": "netAmt",
          "type": "number"
        },
        {
          "name": "enrolNumber",
          "type": "number"
        },
        {
          "name": "discType",
          "type": "text"
        },
        {
          "name": "discVal",
          "type": "number"
        },
        {
          "name": "_procedure",
          "type": "text"
        },
        {
          "name": "fd_sum_before",
          "type": "number"
        },
        {
          "name": "fd_type",
          "type": "text"
        },
        {
          "name": "fd_value",
          "type": "number"
        },
        {
          "name": "fd_amt",
          "type": "number"
        },
        {
          "name": "fd_procedure",
          "type": "text"
        },
        {
          "name": "netAmt_total",
          "type": "number"
        },
        {
          "name": "enr_grandTotal",
          "type": "number"
        },
        {
          "name": "net_grandTotal",
          "type": "number"
        },
        {
          "name": "discDir",
          "type": "text"
        },
        {
          "name": "chargeId",
          "type": "text"
        },
        {
          "name": "lineInvNumber",
          "type": "text"
        },
        {
          "name": "status",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "rp_studentChargeBreakdown": {
      "meta": [
        {
          "name": "classTotal",
          "type": "number"
        },
        {
          "name": "enrolid",
          "type": "number"
        },
        {
          "name": "startDate",
          "type": "date"
        },
        {
          "name": "dropDate",
          "type": "date"
        },
        {
          "name": "classStartTime",
          "type": "text"
        },
        {
          "name": "classEndTime",
          "type": "text"
        },
        {
          "name": "classLevelName",
          "type": "text"
        },
        {
          "name": "classDay",
          "type": "text"
        },
        {
          "name": "instructorFirst",
          "type": "text"
        },
        {
          "name": "instructorLast",
          "type": "text"
        },
        {
          "name": "enrolmentCharges",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "startofweek",
              "type": "date"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "classTypeId",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "classDate",
              "type": "date"
            },
            {
              "name": "enrolCount",
              "type": "text"
            },
            {
              "name": "baseRate",
              "type": "number"
            },
            {
              "name": "discAmt",
              "type": "number"
            },
            {
              "name": "netAmt",
              "type": "number"
            },
            {
              "name": "enrolNumber",
              "type": "number"
            },
            {
              "name": "discType",
              "type": "text"
            },
            {
              "name": "discVal",
              "type": "number"
            },
            {
              "name": "_procedure",
              "type": "text"
            },
            {
              "name": "fd_sum_before",
              "type": "number"
            },
            {
              "name": "fd_type",
              "type": "text"
            },
            {
              "name": "fd_value",
              "type": "number"
            },
            {
              "name": "fd_amt",
              "type": "number"
            },
            {
              "name": "fd_procedure",
              "type": "text"
            },
            {
              "name": "netAmt_total",
              "type": "number"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "net_grandTotal",
              "type": "number"
            },
            {
              "name": "discDir",
              "type": "text"
            },
            {
              "name": "chargeId",
              "type": "text"
            },
            {
              "name": "lineInvNumber",
              "type": "text"
            },
            {
              "name": "status",
              "type": "text"
            }
          ]
        },
        {
          "name": "classId",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "var_chargid": {
      "meta": null,
      "outputType": "text"
    },
    "rp_chargeStudents": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "enrolmentsCount",
          "type": "number"
        },
        {
          "name": "enrolmentsTotal",
          "type": "number"
        },
        {
          "name": "allEnrolmentCharges",
          "type": "array",
          "sub": [
            {
              "name": "classTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "startDate",
              "type": "date"
            },
            {
              "name": "dropDate",
              "type": "date"
            },
            {
              "name": "classStartTime",
              "type": "text"
            },
            {
              "name": "classEndTime",
              "type": "text"
            },
            {
              "name": "classLevelName",
              "type": "text"
            },
            {
              "name": "classDay",
              "type": "text"
            },
            {
              "name": "instructorFirst",
              "type": "text"
            },
            {
              "name": "instructorLast",
              "type": "text"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "enrolmentCharges",
              "type": "array",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "startofweek",
                  "type": "date"
                },
                {
                  "name": "classId",
                  "type": "number"
                },
                {
                  "name": "studentid",
                  "type": "number"
                },
                {
                  "name": "classTypeId",
                  "type": "number"
                },
                {
                  "name": "enrolid",
                  "type": "number"
                },
                {
                  "name": "classDate",
                  "type": "date"
                },
                {
                  "name": "enrolCount",
                  "type": "text"
                },
                {
                  "name": "baseRate",
                  "type": "number"
                },
                {
                  "name": "discAmt",
                  "type": "number"
                },
                {
                  "name": "netAmt",
                  "type": "number"
                },
                {
                  "name": "enrolNumber",
                  "type": "number"
                },
                {
                  "name": "discType",
                  "type": "text"
                },
                {
                  "name": "discVal",
                  "type": "number"
                },
                {
                  "name": "_procedure",
                  "type": "text"
                },
                {
                  "name": "fd_sum_before",
                  "type": "number"
                },
                {
                  "name": "fd_type",
                  "type": "text"
                },
                {
                  "name": "fd_value",
                  "type": "number"
                },
                {
                  "name": "fd_amt",
                  "type": "number"
                },
                {
                  "name": "fd_procedure",
                  "type": "text"
                },
                {
                  "name": "netAmt_total",
                  "type": "number"
                },
                {
                  "name": "enr_grandTotal",
                  "type": "number"
                },
                {
                  "name": "net_grandTotal",
                  "type": "number"
                },
                {
                  "name": "discDir",
                  "type": "text"
                },
                {
                  "name": "chargeId",
                  "type": "text"
                },
                {
                  "name": "lineInvNumber",
                  "type": "text"
                },
                {
                  "name": "status",
                  "type": "text"
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "weeksrepeat": {
      "meta": [
        {
          "name": "startofweek",
          "type": "text"
        },
        {
          "name": "infoByClass",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "startofweek",
              "type": "date"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "classTypeId",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "classDate",
              "type": "date"
            },
            {
              "name": "enrolCount",
              "type": "text"
            },
            {
              "name": "baseRate",
              "type": "number"
            },
            {
              "name": "discAmt",
              "type": "number"
            },
            {
              "name": "netAmt",
              "type": "number"
            },
            {
              "name": "enrolNumber",
              "type": "number"
            },
            {
              "name": "discType",
              "type": "text"
            },
            {
              "name": "discVal",
              "type": "number"
            },
            {
              "name": "_procedure",
              "type": "text"
            },
            {
              "name": "fd_sum_before",
              "type": "number"
            },
            {
              "name": "fd_type",
              "type": "text"
            },
            {
              "name": "fd_value",
              "type": "number"
            },
            {
              "name": "fd_amt",
              "type": "number"
            },
            {
              "name": "fd_procedure",
              "type": "text"
            },
            {
              "name": "netAmt_total",
              "type": "number"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "net_grandTotal",
              "type": "number"
            },
            {
              "name": "discDir",
              "type": "text"
            },
            {
              "name": "chargeId",
              "type": "text"
            },
            {
              "name": "lineInvNumber",
              "type": "text"
            },
            {
              "name": "status",
              "type": "text"
            },
            {
              "name": "classInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "startTimeDecimal",
                  "type": "number"
                },
                {
                  "name": "endTimeDecimal",
                  "type": "number"
                },
                {
                  "name": "isactive",
                  "type": "boolean"
                },
                {
                  "name": "instructor",
                  "type": "text"
                },
                {
                  "name": "classLevel",
                  "type": "text"
                },
                {
                  "name": "day",
                  "type": "text"
                },
                {
                  "name": "startTimeDisplay",
                  "type": "text"
                },
                {
                  "name": "endTimeDisplay",
                  "type": "text"
                },
                {
                  "name": "max",
                  "type": "number"
                },
                {
                  "name": "classType",
                  "type": "number"
                },
                {
                  "name": "enrolCount",
                  "type": "number"
                },
                {
                  "name": "actEnr",
                  "type": "number"
                },
                {
                  "name": "muEnr",
                  "type": "number"
                },
                {
                  "name": "trEnr",
                  "type": "number"
                },
                {
                  "name": "waEnr",
                  "type": "number"
                },
                {
                  "name": "dayname",
                  "type": "text"
                },
                {
                  "name": "instructorFirst",
                  "type": "text"
                },
                {
                  "name": "instructorLast",
                  "type": "text"
                }
              ]
            },
            {
              "name": "instructorInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "firstName",
                  "type": "text"
                },
                {
                  "name": "lastName",
                  "type": "text"
                },
                {
                  "name": "phone",
                  "type": "text"
                },
                {
                  "name": "email",
                  "type": "text"
                },
                {
                  "name": "staffTypes",
                  "type": "text"
                }
              ]
            },
            {
              "name": "classLevel",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "name",
                  "type": "text"
                },
                {
                  "name": "isValid",
                  "type": "boolean"
                },
                {
                  "name": "colour",
                  "type": "text"
                },
                {
                  "name": "order",
                  "type": "number"
                },
                {
                  "name": "classType",
                  "type": "text"
                }
              ]
            },
            {
              "name": "studentInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "firstName",
                  "type": "text"
                },
                {
                  "name": "lastName",
                  "type": "text"
                },
                {
                  "name": "dob",
                  "type": "date"
                },
                {
                  "name": "rollSheetComments",
                  "type": "text"
                },
                {
                  "name": "rollSheetMedical",
                  "type": "text"
                },
                {
                  "name": "additionalMedical",
                  "type": "text"
                },
                {
                  "name": "family",
                  "type": "text"
                },
                {
                  "name": "gender",
                  "type": "text"
                },
                {
                  "name": "level",
                  "type": "text"
                },
                {
                  "name": "age",
                  "type": "text"
                }
              ]
            },
            {
              "name": "enrolmentInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "enrolmentType",
                  "type": "number"
                },
                {
                  "name": "dropDate",
                  "type": "date"
                },
                {
                  "name": "isValid",
                  "type": "boolean"
                },
                {
                  "name": "student",
                  "type": "text"
                },
                {
                  "name": "startDate",
                  "type": "date"
                },
                {
                  "name": "classId",
                  "type": "number"
                },
                {
                  "name": "dropReason",
                  "type": "text"
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "stEnrolWeekRepeat_ChargeBreakdowns": {
      "meta": [
        {
          "name": "startofweek",
          "type": "text"
        },
        {
          "name": "infoByClass",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "startofweek",
              "type": "date"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "classTypeId",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "classDate",
              "type": "date"
            },
            {
              "name": "enrolCount",
              "type": "text"
            },
            {
              "name": "baseRate",
              "type": "number"
            },
            {
              "name": "discAmt",
              "type": "number"
            },
            {
              "name": "netAmt",
              "type": "number"
            },
            {
              "name": "enrolNumber",
              "type": "number"
            },
            {
              "name": "discType",
              "type": "text"
            },
            {
              "name": "discVal",
              "type": "number"
            },
            {
              "name": "_procedure",
              "type": "text"
            },
            {
              "name": "fd_sum_before",
              "type": "number"
            },
            {
              "name": "fd_type",
              "type": "text"
            },
            {
              "name": "fd_value",
              "type": "number"
            },
            {
              "name": "fd_amt",
              "type": "number"
            },
            {
              "name": "fd_procedure",
              "type": "text"
            },
            {
              "name": "netAmt_total",
              "type": "number"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "net_grandTotal",
              "type": "number"
            },
            {
              "name": "discDir",
              "type": "text"
            },
            {
              "name": "chargeId",
              "type": "text"
            },
            {
              "name": "lineInvNumber",
              "type": "text"
            },
            {
              "name": "status",
              "type": "text"
            },
            {
              "name": "classInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "startTimeDecimal",
                  "type": "number"
                },
                {
                  "name": "endTimeDecimal",
                  "type": "number"
                },
                {
                  "name": "isactive",
                  "type": "boolean"
                },
                {
                  "name": "instructor",
                  "type": "text"
                },
                {
                  "name": "classLevel",
                  "type": "text"
                },
                {
                  "name": "day",
                  "type": "text"
                },
                {
                  "name": "startTimeDisplay",
                  "type": "text"
                },
                {
                  "name": "endTimeDisplay",
                  "type": "text"
                },
                {
                  "name": "max",
                  "type": "number"
                },
                {
                  "name": "classType",
                  "type": "number"
                },
                {
                  "name": "enrolCount",
                  "type": "number"
                },
                {
                  "name": "actEnr",
                  "type": "number"
                },
                {
                  "name": "muEnr",
                  "type": "number"
                },
                {
                  "name": "trEnr",
                  "type": "number"
                },
                {
                  "name": "waEnr",
                  "type": "number"
                },
                {
                  "name": "dayname",
                  "type": "text"
                },
                {
                  "name": "instructorFirst",
                  "type": "text"
                },
                {
                  "name": "instructorLast",
                  "type": "text"
                }
              ]
            },
            {
              "name": "instructorInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "firstName",
                  "type": "text"
                },
                {
                  "name": "lastName",
                  "type": "text"
                },
                {
                  "name": "phone",
                  "type": "text"
                },
                {
                  "name": "email",
                  "type": "text"
                },
                {
                  "name": "staffTypes",
                  "type": "text"
                }
              ]
            },
            {
              "name": "classLevel",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "name",
                  "type": "text"
                },
                {
                  "name": "isValid",
                  "type": "boolean"
                },
                {
                  "name": "colour",
                  "type": "text"
                },
                {
                  "name": "order",
                  "type": "number"
                },
                {
                  "name": "classType",
                  "type": "text"
                }
              ]
            },
            {
              "name": "studentInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "firstName",
                  "type": "text"
                },
                {
                  "name": "lastName",
                  "type": "text"
                },
                {
                  "name": "dob",
                  "type": "date"
                },
                {
                  "name": "rollSheetComments",
                  "type": "text"
                },
                {
                  "name": "rollSheetMedical",
                  "type": "text"
                },
                {
                  "name": "additionalMedical",
                  "type": "text"
                },
                {
                  "name": "family",
                  "type": "text"
                },
                {
                  "name": "gender",
                  "type": "text"
                },
                {
                  "name": "level",
                  "type": "text"
                },
                {
                  "name": "age",
                  "type": "text"
                }
              ]
            },
            {
              "name": "enrolmentInformation",
              "type": "object",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "enrolmentType",
                  "type": "number"
                },
                {
                  "name": "dropDate",
                  "type": "date"
                },
                {
                  "name": "isValid",
                  "type": "boolean"
                },
                {
                  "name": "student",
                  "type": "text"
                },
                {
                  "name": "startDate",
                  "type": "date"
                },
                {
                  "name": "classId",
                  "type": "number"
                },
                {
                  "name": "dropReason",
                  "type": "text"
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "tbl_studentClassBreakdown": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "startofweek",
          "type": "date"
        },
        {
          "name": "classId",
          "type": "number"
        },
        {
          "name": "studentid",
          "type": "number"
        },
        {
          "name": "classTypeId",
          "type": "number"
        },
        {
          "name": "enrolid",
          "type": "number"
        },
        {
          "name": "classDate",
          "type": "date"
        },
        {
          "name": "enrolCount",
          "type": "text"
        },
        {
          "name": "baseRate",
          "type": "number"
        },
        {
          "name": "discAmt",
          "type": "number"
        },
        {
          "name": "netAmt",
          "type": "number"
        },
        {
          "name": "enrolNumber",
          "type": "number"
        },
        {
          "name": "discType",
          "type": "text"
        },
        {
          "name": "discVal",
          "type": "number"
        },
        {
          "name": "_procedure",
          "type": "text"
        },
        {
          "name": "fd_sum_before",
          "type": "number"
        },
        {
          "name": "fd_type",
          "type": "text"
        },
        {
          "name": "fd_value",
          "type": "number"
        },
        {
          "name": "fd_amt",
          "type": "number"
        },
        {
          "name": "fd_procedure",
          "type": "text"
        },
        {
          "name": "netAmt_total",
          "type": "number"
        },
        {
          "name": "enr_grandTotal",
          "type": "number"
        },
        {
          "name": "net_grandTotal",
          "type": "number"
        },
        {
          "name": "discDir",
          "type": "text"
        },
        {
          "name": "chargeId",
          "type": "text"
        },
        {
          "name": "lineInvNumber",
          "type": "text"
        },
        {
          "name": "status",
          "type": "text"
        },
        {
          "name": "classInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "startTimeDecimal",
              "type": "number"
            },
            {
              "name": "endTimeDecimal",
              "type": "number"
            },
            {
              "name": "isactive",
              "type": "boolean"
            },
            {
              "name": "instructor",
              "type": "text"
            },
            {
              "name": "classLevel",
              "type": "text"
            },
            {
              "name": "day",
              "type": "text"
            },
            {
              "name": "startTimeDisplay",
              "type": "text"
            },
            {
              "name": "endTimeDisplay",
              "type": "text"
            },
            {
              "name": "max",
              "type": "number"
            },
            {
              "name": "classType",
              "type": "number"
            },
            {
              "name": "enrolCount",
              "type": "number"
            },
            {
              "name": "actEnr",
              "type": "number"
            },
            {
              "name": "muEnr",
              "type": "number"
            },
            {
              "name": "trEnr",
              "type": "number"
            },
            {
              "name": "waEnr",
              "type": "number"
            },
            {
              "name": "dayname",
              "type": "text"
            },
            {
              "name": "instructorFirst",
              "type": "text"
            },
            {
              "name": "instructorLast",
              "type": "text"
            }
          ]
        },
        {
          "name": "instructorInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "phone",
              "type": "text"
            },
            {
              "name": "email",
              "type": "text"
            },
            {
              "name": "staffTypes",
              "type": "text"
            }
          ]
        },
        {
          "name": "classLevel",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "name",
              "type": "text"
            },
            {
              "name": "isValid",
              "type": "boolean"
            },
            {
              "name": "colour",
              "type": "text"
            },
            {
              "name": "order",
              "type": "number"
            },
            {
              "name": "classType",
              "type": "text"
            }
          ]
        },
        {
          "name": "studentInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "dob",
              "type": "date"
            },
            {
              "name": "rollSheetComments",
              "type": "text"
            },
            {
              "name": "rollSheetMedical",
              "type": "text"
            },
            {
              "name": "additionalMedical",
              "type": "text"
            },
            {
              "name": "family",
              "type": "text"
            },
            {
              "name": "gender",
              "type": "text"
            },
            {
              "name": "level",
              "type": "text"
            },
            {
              "name": "age",
              "type": "text"
            }
          ]
        },
        {
          "name": "enrolmentInformation",
          "type": "object",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "enrolmentType",
              "type": "number"
            },
            {
              "name": "dropDate",
              "type": "date"
            },
            {
              "name": "isValid",
              "type": "boolean"
            },
            {
              "name": "student",
              "type": "text"
            },
            {
              "name": "startDate",
              "type": "date"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "dropReason",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "masonry1": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "enrolmentsCount",
          "type": "number"
        },
        {
          "name": "enrolmentsTotal",
          "type": "number"
        },
        {
          "name": "allEnrolmentCharges",
          "type": "array",
          "sub": [
            {
              "name": "classTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "student",
              "type": "text"
            },
            {
              "name": "startDate",
              "type": "date"
            },
            {
              "name": "dropDate",
              "type": "date"
            },
            {
              "name": "classStartTime",
              "type": "text"
            },
            {
              "name": "classEndTime",
              "type": "text"
            },
            {
              "name": "classLevelName",
              "type": "text"
            },
            {
              "name": "classDay",
              "type": "text"
            },
            {
              "name": "instructorFirst",
              "type": "text"
            },
            {
              "name": "instructorLast",
              "type": "text"
            },
            {
              "name": "classId",
              "type": "number"
            },
            {
              "name": "enrolmentCharges",
              "type": "array",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "startofweek",
                  "type": "date"
                },
                {
                  "name": "classId",
                  "type": "number"
                },
                {
                  "name": "studentid",
                  "type": "number"
                },
                {
                  "name": "classTypeId",
                  "type": "number"
                },
                {
                  "name": "enrolid",
                  "type": "number"
                },
                {
                  "name": "classDate",
                  "type": "date"
                },
                {
                  "name": "enrolCount",
                  "type": "text"
                },
                {
                  "name": "baseRate",
                  "type": "number"
                },
                {
                  "name": "discAmt",
                  "type": "number"
                },
                {
                  "name": "netAmt",
                  "type": "number"
                },
                {
                  "name": "enrolNumber",
                  "type": "number"
                },
                {
                  "name": "discType",
                  "type": "text"
                },
                {
                  "name": "discVal",
                  "type": "number"
                },
                {
                  "name": "_procedure",
                  "type": "text"
                },
                {
                  "name": "fd_sum_before",
                  "type": "number"
                },
                {
                  "name": "fd_type",
                  "type": "text"
                },
                {
                  "name": "fd_value",
                  "type": "number"
                },
                {
                  "name": "fd_amt",
                  "type": "number"
                },
                {
                  "name": "fd_procedure",
                  "type": "text"
                },
                {
                  "name": "netAmt_total",
                  "type": "number"
                },
                {
                  "name": "enr_grandTotal",
                  "type": "number"
                },
                {
                  "name": "net_grandTotal",
                  "type": "number"
                },
                {
                  "name": "discDir",
                  "type": "text"
                },
                {
                  "name": "chargeId",
                  "type": "text"
                },
                {
                  "name": "lineInvNumber",
                  "type": "text"
                },
                {
                  "name": "status",
                  "type": "text"
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "rp_chargePayments": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "amount",
          "type": "number"
        },
        {
          "name": "paymentType",
          "type": "number"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "charges",
          "type": "number"
        },
        {
          "name": "payref",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "notes",
          "type": "text"
        },
        {
          "name": "paymentdate",
          "type": "text"
        },
        {
          "name": "lineItems",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "enrolment",
              "type": "text"
            },
            {
              "name": "updated",
              "type": "datetime"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "dd_paymentLineItems": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "date"
        },
        {
          "name": "chargeDateFrom",
          "type": "date"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "date"
        },
        {
          "name": "dueDate",
          "type": "date"
        },
        {
          "name": "chargeType",
          "type": "text"
        },
        {
          "name": "chargePaymentsTotal",
          "type": "array",
          "sub": [
            {
              "name": "SUM(amount)",
              "type": "number"
            }
          ]
        },
        {
          "name": "getEnrolmentChargeIds",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "firstName",
              "type": "text"
            },
            {
              "name": "lastName",
              "type": "text"
            },
            {
              "name": "enrolmentsCount",
              "type": "number"
            },
            {
              "name": "enrolmentsTotal",
              "type": "number"
            },
            {
              "name": "allEnrolmentCharges",
              "type": "array",
              "sub": [
                {
                  "name": "classTotal",
                  "type": "number"
                },
                {
                  "name": "enrolid",
                  "type": "number"
                },
                {
                  "name": "student",
                  "type": "text"
                },
                {
                  "name": "startDate",
                  "type": "date"
                },
                {
                  "name": "dropDate",
                  "type": "date"
                },
                {
                  "name": "classStartTime",
                  "type": "text"
                },
                {
                  "name": "classEndTime",
                  "type": "text"
                },
                {
                  "name": "classLevelName",
                  "type": "text"
                },
                {
                  "name": "classDay",
                  "type": "text"
                },
                {
                  "name": "instructorFirst",
                  "type": "text"
                },
                {
                  "name": "instructorLast",
                  "type": "text"
                },
                {
                  "name": "classId",
                  "type": "number"
                },
                {
                  "name": "enrolmentCharges",
                  "type": "array",
                  "sub": [
                    {
                      "name": "id",
                      "type": "text"
                    },
                    {
                      "name": "startofweek",
                      "type": "date"
                    },
                    {
                      "name": "classId",
                      "type": "number"
                    },
                    {
                      "name": "studentid",
                      "type": "number"
                    },
                    {
                      "name": "classTypeId",
                      "type": "number"
                    },
                    {
                      "name": "enrolid",
                      "type": "number"
                    },
                    {
                      "name": "classDate",
                      "type": "date"
                    },
                    {
                      "name": "enrolCount",
                      "type": "text"
                    },
                    {
                      "name": "baseRate",
                      "type": "number"
                    },
                    {
                      "name": "discAmt",
                      "type": "number"
                    },
                    {
                      "name": "netAmt",
                      "type": "number"
                    },
                    {
                      "name": "enrolNumber",
                      "type": "number"
                    },
                    {
                      "name": "discType",
                      "type": "text"
                    },
                    {
                      "name": "discVal",
                      "type": "number"
                    },
                    {
                      "name": "_procedure",
                      "type": "text"
                    },
                    {
                      "name": "fd_sum_before",
                      "type": "number"
                    },
                    {
                      "name": "fd_type",
                      "type": "text"
                    },
                    {
                      "name": "fd_value",
                      "type": "number"
                    },
                    {
                      "name": "fd_amt",
                      "type": "number"
                    },
                    {
                      "name": "fd_procedure",
                      "type": "text"
                    },
                    {
                      "name": "netAmt_total",
                      "type": "number"
                    },
                    {
                      "name": "enr_grandTotal",
                      "type": "number"
                    },
                    {
                      "name": "net_grandTotal",
                      "type": "number"
                    },
                    {
                      "name": "discDir",
                      "type": "text"
                    },
                    {
                      "name": "chargeId",
                      "type": "text"
                    },
                    {
                      "name": "lineInvNumber",
                      "type": "text"
                    },
                    {
                      "name": "status",
                      "type": "text"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "paymentLineItemsList",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "amount",
              "type": "number"
            },
            {
              "name": "paymentType",
              "type": "number"
            },
            {
              "name": "family",
              "type": "number"
            },
            {
              "name": "charges",
              "type": "number"
            },
            {
              "name": "payref",
              "type": "text"
            },
            {
              "name": "title",
              "type": "text"
            },
            {
              "name": "notes",
              "type": "text"
            },
            {
              "name": "paymentdate",
              "type": "text"
            },
            {
              "name": "lineItems",
              "type": "array",
              "sub": [
                {
                  "name": "id",
                  "type": "text"
                },
                {
                  "name": "enrolment",
                  "type": "text"
                },
                {
                  "name": "updated",
                  "type": "datetime"
                }
              ]
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "localStorage": [
      {
        "type": "array",
        "name": "new"
      }
    ],
    "sessionStorage": [
      {
        "type": "array",
        "name": "paymentLineItems"
      },
      {
        "type": "text",
        "name": "paymentTotal"
      },
      {
        "type": "text",
        "name": "paymentTitle"
      }
    ],
    "rp_familyPayments": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "amount",
          "type": "number"
        },
        {
          "name": "paymentType",
          "type": "number"
        },
        {
          "name": "family",
          "type": "text"
        },
        {
          "name": "charges",
          "type": "number"
        },
        {
          "name": "payref",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "notes",
          "type": "text"
        },
        {
          "name": "paymentdate",
          "type": "datetime"
        }
      ],
      "outputType": "array"
    },
    "rp_payLineItems": {
      "meta": null,
      "outputType": "array"
    },
    "dd_guardianInfo": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "primaryGuardian",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "number"
        },
        {
          "name": "phoneNumbers",
          "type": "text"
        },
        {
          "name": "email",
          "type": "text"
        },
        {
          "name": "emailAddresses",
          "type": "text"
        },
        {
          "name": "phoneNumbersArray",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "text",
              "name": "phone"
            },
            {
              "type": "number",
              "name": "guardianId"
            },
            {
              "type": "number",
              "name": "type"
            }
          ]
        },
        {
          "name": "emailAddressesArray",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "text",
              "name": "address"
            },
            {
              "type": "number",
              "name": "guardianId"
            },
            {
              "type": "number",
              "name": "type"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "rp_guardianPhones": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "text",
          "name": "phone"
        },
        {
          "type": "number",
          "name": "guardianId"
        },
        {
          "type": "number",
          "name": "type"
        }
      ],
      "outputType": "array"
    },
    "rp_guardianEmails": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "text",
          "name": "address"
        },
        {
          "type": "number",
          "name": "guardianId"
        },
        {
          "type": "number",
          "name": "type"
        }
      ],
      "outputType": "array"
    },
    "dd_studentInfo": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "firstname",
          "type": "text"
        },
        {
          "name": "lastname",
          "type": "text"
        },
        {
          "name": "dob",
          "type": "text"
        },
        {
          "name": "age",
          "type": "text"
        },
        {
          "name": "level",
          "type": "number"
        },
        {
          "name": "getStudentNotes",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "priority"
            },
            {
              "type": "text",
              "name": "content"
            },
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "number",
              "name": "student"
            },
            {
              "type": "text",
              "name": "subject"
            }
          ]
        },
        {
          "name": "groupedPriorities",
          "type": "array",
          "sub": [
            {
              "name": "COUNT(*)",
              "type": "number"
            },
            {
              "name": "priority",
              "type": "number"
            },
            {
              "name": "priority_name",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "checkEmail": [
      {
        "name": "$param",
        "type": "object",
        "sub": [
          {
            "type": "text",
            "name": "email"
          }
        ]
      },
      {
        "name": "checkemail",
        "type": "object",
        "sub": [
          {
            "name": "data",
            "type": "object",
            "sub": [
              {
                "name": "emailCheck",
                "type": "object",
                "sub": [
                  {
                    "type": "number",
                    "name": "id"
                  },
                  {
                    "type": "text",
                    "name": "address"
                  },
                  {
                    "type": "number",
                    "name": "guardianId"
                  },
                  {
                    "type": "number",
                    "name": "type"
                  }
                ]
              }
            ]
          },
          {
            "name": "state",
            "type": "object",
            "sub": [
              {
                "name": "executing",
                "type": "boolean"
              },
              {
                "name": "uploading",
                "type": "boolean"
              },
              {
                "name": "processing",
                "type": "boolean"
              },
              {
                "name": "downloading",
                "type": "boolean"
              }
            ]
          },
          {
            "name": "uploadProgress",
            "type": "object",
            "sub": [
              {
                "name": "position",
                "type": "number"
              },
              {
                "name": "total",
                "type": "number"
              },
              {
                "name": "percent",
                "type": "number"
              }
            ]
          },
          {
            "name": "downloadProgress",
            "type": "object",
            "sub": [
              {
                "name": "position",
                "type": "number"
              },
              {
                "name": "total",
                "type": "number"
              },
              {
                "name": "percent",
                "type": "number"
              }
            ]
          },
          {
            "name": "lastError",
            "type": "object",
            "sub": [
              {
                "name": "status",
                "type": "number"
              },
              {
                "name": "message",
                "type": "text"
              },
              {
                "name": "response",
                "type": "text"
              }
            ]
          },
          {
            "name": "status",
            "type": "number"
          }
        ]
      }
    ],
    "checkEmailFlow": [
      {
        "name": "$param",
        "type": "object",
        "sub": [
          {
            "type": "text",
            "name": "email"
          }
        ]
      },
      {
        "name": "checkemail",
        "type": "object",
        "sub": [
          {
            "name": "data",
            "type": "object",
            "sub": [
              {
                "name": "emailCheck",
                "type": "object",
                "sub": [
                  {
                    "type": "number",
                    "name": "id"
                  },
                  {
                    "type": "text",
                    "name": "address"
                  },
                  {
                    "type": "number",
                    "name": "guardianId"
                  },
                  {
                    "type": "number",
                    "name": "type"
                  }
                ]
              }
            ]
          },
          {
            "name": "state",
            "type": "object",
            "sub": [
              {
                "name": "executing",
                "type": "boolean"
              },
              {
                "name": "uploading",
                "type": "boolean"
              },
              {
                "name": "processing",
                "type": "boolean"
              },
              {
                "name": "downloading",
                "type": "boolean"
              }
            ]
          },
          {
            "name": "uploadProgress",
            "type": "object",
            "sub": [
              {
                "name": "position",
                "type": "number"
              },
              {
                "name": "total",
                "type": "number"
              },
              {
                "name": "percent",
                "type": "number"
              }
            ]
          },
          {
            "name": "downloadProgress",
            "type": "object",
            "sub": [
              {
                "name": "position",
                "type": "number"
              },
              {
                "name": "total",
                "type": "number"
              },
              {
                "name": "percent",
                "type": "number"
              }
            ]
          },
          {
            "name": "lastError",
            "type": "object",
            "sub": [
              {
                "name": "status",
                "type": "number"
              },
              {
                "name": "message",
                "type": "text"
              },
              {
                "name": "response",
                "type": "text"
              }
            ]
          },
          {
            "name": "status",
            "type": "number"
          }
        ]
      }
    ],
    "var_checkEmailStatus": {
      "meta": null,
      "outputType": "text"
    },
    "checkEmailArray": [
      {
        "name": "$param",
        "type": "object",
        "sub": [
          {
            "type": "text",
            "name": "email"
          },
          {
            "type": "array",
            "name": "emailArr"
          }
        ]
      },
      {
        "name": "var_continue",
        "type": "text"
      },
      {
        "name": "var_continue",
        "type": "text"
      },
      {
        "name": "var_continue",
        "type": "text"
      }
    ],
    "newGuardianId": {
      "meta": null,
      "outputType": "text"
    },
    "dd_guardianDetails": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "primaryGuardian",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "number"
        },
        {
          "name": "phoneNumbers",
          "type": "text"
        },
        {
          "name": "email",
          "type": "text"
        },
        {
          "name": "emailAddresses",
          "type": "text"
        },
        {
          "name": "phoneNumbersArray",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "text",
              "name": "phone"
            },
            {
              "type": "number",
              "name": "guardianId"
            },
            {
              "type": "number",
              "name": "type"
            }
          ]
        },
        {
          "name": "emailAddressesArray",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "text",
              "name": "address"
            },
            {
              "type": "number",
              "name": "guardianId"
            },
            {
              "type": "number",
              "name": "type"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "var_countryid": {
      "meta": null,
      "outputType": "number"
    },
    "var_stateid": {
      "meta": null,
      "outputType": "number"
    },
    "addressrepeat": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "text",
          "name": "street1"
        },
        {
          "type": "text",
          "name": "street2"
        },
        {
          "type": "text",
          "name": "unit"
        },
        {
          "type": "text",
          "name": "suburb"
        },
        {
          "type": "text",
          "name": "postcode"
        },
        {
          "type": "number",
          "name": "country"
        },
        {
          "type": "number",
          "name": "state"
        },
        {
          "type": "number",
          "name": "family"
        }
      ],
      "outputType": "array"
    },
    "addressRepeat": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "text",
          "name": "street1"
        },
        {
          "type": "text",
          "name": "street2"
        },
        {
          "type": "text",
          "name": "unit"
        },
        {
          "type": "text",
          "name": "suburb"
        },
        {
          "type": "text",
          "name": "postcode"
        },
        {
          "type": "number",
          "name": "country"
        },
        {
          "type": "number",
          "name": "state"
        },
        {
          "type": "number",
          "name": "family"
        }
      ],
      "outputType": "array"
    },
    "rp_phones": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "text",
          "name": "phone"
        },
        {
          "type": "number",
          "name": "guardianId"
        },
        {
          "type": "number",
          "name": "type"
        }
      ],
      "outputType": "array"
    },
    "rp_chargeperiod": {
      "meta": [],
      "outputType": "text"
    },
    "rp_periodcharges_output": {
      "meta": [
        {
          "name": "familycharges",
          "type": "text",
          "sub": [
            {
              "name": "dates",
              "type": "array"
            }
          ]
        }
      ],
      "outputType": "array"
    }
  },
  "createFamily": {
    "studentDatastore": [
      {
        "type": "text",
        "name": "firstName"
      },
      {
        "type": "text",
        "name": "lastName"
      },
      {
        "type": "text",
        "name": "dob"
      },
      {
        "type": "text",
        "name": "level"
      }
    ],
    "phoneNumbersDatastore": [
      {
        "type": "text",
        "name": "phoneNumber"
      }
    ],
    "emailsNumbersDatastore": [
      {
        "type": "text",
        "name": "email"
      }
    ],
    "tableRepeat3": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "email"
        }
      ],
      "outputType": "array"
    },
    "emailsDatastore": [
      {
        "type": "text",
        "name": "email"
      }
    ],
    "guardianDatastore": [
      {
        "type": "text",
        "name": "firstName"
      },
      {
        "type": "text",
        "name": "lastName"
      },
      {
        "type": "text",
        "name": "relationship"
      },
      {
        "type": "text",
        "name": "email"
      },
      {
        "type": "text",
        "name": "phoneNumber"
      },
      {
        "type": "text",
        "name": "isPrimary"
      }
    ],
    "repeat1": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "email"
        }
      ],
      "outputType": "array"
    },
    "arr_emails": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "email"
        }
      ],
      "outputType": "array"
    },
    "arr_phoneNumbers": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "phoneNumber"
        }
      ],
      "outputType": "array"
    },
    "rp_phonenumbers": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "type": "text",
          "name": "number"
        }
      ],
      "outputType": "array"
    },
    "var1": {
      "meta": null,
      "outputType": "array"
    },
    "guardians": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "firstName"
        },
        {
          "type": "text",
          "name": "lastName"
        },
        {
          "type": "text",
          "name": "relationship"
        },
        {
          "type": "text",
          "name": "relationshipName"
        },
        {
          "type": "text",
          "name": "email"
        },
        {
          "type": "text",
          "name": "phoneNumber"
        },
        {
          "type": "boolean",
          "name": "isPrimary"
        }
      ],
      "outputType": "array"
    },
    "studentInputs": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "firstName"
        },
        {
          "type": "text",
          "name": "lastName"
        },
        {
          "type": "text",
          "name": "dob"
        },
        {
          "type": "text",
          "name": "level"
        },
        {
          "type": "text",
          "name": "levelName"
        }
      ],
      "outputType": "array"
    }
  },
  "settings": {
    "getSettings": [
      {
        "name": "$param",
        "type": "object",
        "sub": [
          {
            "type": "text",
            "name": "settingsString"
          }
        ]
      },
      {
        "name": "findSettings",
        "type": "text"
      }
    ],
    "arr_settingsList": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "value",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "repeat1": {
      "meta": null,
      "outputType": "text"
    },
    "flow1": [
      {
        "name": "var",
        "type": "text"
      },
      {
        "name": "repeat",
        "type": "array",
        "sub": [
          {
            "name": "$index",
            "type": "number"
          },
          {
            "name": "$number",
            "type": "number"
          },
          {
            "name": "$name",
            "type": "text"
          },
          {
            "name": "$value",
            "type": "object"
          }
        ]
      }
    ],
    "arr1": {
      "meta": [
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "value",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "sessionStorage": [
      {
        "type": "key_array",
        "name": "settings",
        "sub": [
          {
            "type": "text",
            "name": "key"
          },
          {
            "type": "text",
            "name": "value"
          }
        ]
      }
    ],
    "settingsUpdatedDS": [
      {
        "type": "text",
        "name": "key"
      },
      {
        "type": "text",
        "name": "value"
      }
    ],
    "classLevelsSettings": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "isValid",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "dd_editClassLevel": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "isValid",
          "type": "boolean"
        },
        {
          "name": "colour",
          "type": "text"
        },
        {
          "name": "order",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "var_stripeOnboardingText": {
      "meta": null,
      "outputType": "boolean"
    }
  },
  "classes": {
    "var_classDurationSum": {
      "meta": null,
      "outputType": "text"
    },
    "startEndTimeCalc": [
      {
        "name": "endTimeCalc",
        "type": "text"
      }
    ],
    "var_startTimeDisplay": {
      "meta": null,
      "outputType": "number"
    },
    "timeToDisplay": [
      {
        "name": "displayTime",
        "type": "text"
      }
    ],
    "classesTableRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "day",
          "type": "text"
        },
        {
          "name": "dayId",
          "type": "number"
        },
        {
          "name": "start",
          "type": "text"
        },
        {
          "name": "end",
          "type": "text"
        },
        {
          "name": "startDec",
          "type": "number"
        },
        {
          "name": "endDec",
          "type": "number"
        },
        {
          "name": "level",
          "type": "text"
        },
        {
          "name": "levelId",
          "type": "number"
        },
        {
          "name": "instructor",
          "type": "text"
        },
        {
          "name": "instructorId",
          "type": "number"
        },
        {
          "name": "maxEnrolments",
          "type": "number"
        },
        {
          "name": "enrolCount",
          "type": "number"
        },
        {
          "name": "activeEnrolments",
          "type": "number"
        },
        {
          "name": "makeupEnrolments",
          "type": "number"
        },
        {
          "name": "trialEnrolments",
          "type": "number"
        },
        {
          "name": "waitlisted",
          "type": "number"
        },
        {
          "name": "classTypeId",
          "type": "number"
        },
        {
          "name": "classTypeShort",
          "type": "text"
        },
        {
          "name": "classTypeLong",
          "type": "text"
        },
        {
          "name": "query",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "text"
            },
            {
              "name": "startDate",
              "type": "date"
            },
            {
              "name": "dropDate",
              "type": "date"
            },
            {
              "name": "isValid",
              "type": "boolean"
            },
            {
              "name": "student",
              "type": "text"
            },
            {
              "name": "enrolmentType",
              "type": "number"
            },
            {
              "name": "classId",
              "type": "number"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "dd_classDetails": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "startTimeDecimal",
          "type": "number"
        },
        {
          "name": "endTimeDecimal",
          "type": "number"
        },
        {
          "name": "isactive",
          "type": "boolean"
        },
        {
          "name": "instructor",
          "type": "text"
        },
        {
          "name": "classLevel",
          "type": "text"
        },
        {
          "name": "day",
          "type": "text"
        },
        {
          "name": "startTimeDisplay",
          "type": "text"
        },
        {
          "name": "endTimeDisplay",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "query": [
      {
        "type": "text",
        "name": "limit"
      },
      {
        "type": "text",
        "name": "sort"
      },
      {
        "type": "text",
        "name": "dir"
      },
      {
        "type": "text",
        "name": "offset"
      },
      {
        "type": "array",
        "name": "days"
      },
      {
        "type": "array",
        "name": "times"
      },
      {
        "type": "array",
        "name": "levels"
      },
      {
        "type": "array",
        "name": "instructors"
      },
      {
        "type": "text",
        "name": "tr_offset"
      }
    ],
    "repeat1": {
      "meta": null,
      "outputType": "array"
    },
    "sessionStorage": [
      {
        "type": "array",
        "name": "days"
      }
    ],
    "activeEnrolmentsTableRepeat": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "number",
          "name": "enrolmentType"
        },
        {
          "type": "date",
          "name": "dropDate"
        },
        {
          "type": "boolean",
          "name": "isValid"
        },
        {
          "type": "number",
          "name": "student"
        },
        {
          "type": "date",
          "name": "startDate"
        },
        {
          "type": "number",
          "name": "classId"
        },
        {
          "type": "text",
          "name": "dropReason"
        }
      ],
      "outputType": "array"
    },
    "makeupEnrolmentsTableRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "startDate",
          "type": "date"
        },
        {
          "name": "dropDate",
          "type": "date"
        },
        {
          "name": "isValid",
          "type": "boolean"
        },
        {
          "name": "student",
          "type": "text"
        },
        {
          "name": "enrolmentType",
          "type": "number"
        },
        {
          "name": "classId",
          "type": "number"
        }
      ],
      "outputType": "number"
    },
    "trialEnrolmentsTableRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "startDate",
          "type": "date"
        },
        {
          "name": "dropDate",
          "type": "date"
        },
        {
          "name": "isValid",
          "type": "boolean"
        },
        {
          "name": "student",
          "type": "text"
        },
        {
          "name": "enrolmentType",
          "type": "number"
        },
        {
          "name": "classId",
          "type": "number"
        }
      ],
      "outputType": "number"
    },
    "waitlistedTableRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "startDate",
          "type": "date"
        },
        {
          "name": "dropDate",
          "type": "date"
        },
        {
          "name": "isValid",
          "type": "boolean"
        },
        {
          "name": "student",
          "type": "text"
        },
        {
          "name": "enrolmentType",
          "type": "number"
        },
        {
          "name": "classId",
          "type": "number"
        }
      ],
      "outputType": "number"
    },
    "rp_tabs": {
      "meta": [
        {
          "name": "dates",
          "type": "array"
        }
      ],
      "outputType": "text"
    },
    "data_detail1": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "day",
          "type": "text"
        },
        {
          "name": "start",
          "type": "text"
        },
        {
          "name": "end",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        },
        {
          "name": "instructor",
          "type": "text"
        }
      ],
      "outputType": "object"
    },
    "dd_enrolmentClassDetails": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "day",
          "type": "text"
        },
        {
          "name": "start",
          "type": "text"
        },
        {
          "name": "end",
          "type": "text"
        },
        {
          "name": "level",
          "type": "text"
        },
        {
          "name": "instructor",
          "type": "text"
        }
      ],
      "outputType": "object"
    },
    "tableRepeat3": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "name": "classid",
          "type": "text"
        },
        {
          "name": "day",
          "type": "text"
        },
        {
          "name": "startTimeDisplay",
          "type": "text"
        },
        {
          "name": "endTimeDisplay",
          "type": "text"
        },
        {
          "name": "classLevel",
          "type": "text"
        },
        {
          "name": "instructorFirst",
          "type": "text"
        },
        {
          "name": "instructorLast",
          "type": "text"
        },
        {
          "name": "availability",
          "type": "text"
        }
      ],
      "outputType": "array"
    },
    "dd_editClass": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "classLevel",
          "type": "number"
        },
        {
          "name": "day_name",
          "type": "text"
        },
        {
          "name": "day_int",
          "type": "number"
        },
        {
          "name": "startdate",
          "type": "date"
        },
        {
          "name": "enddate",
          "type": "date"
        },
        {
          "name": "classType",
          "type": "number"
        },
        {
          "name": "startTimeDisplay",
          "type": "text"
        },
        {
          "name": "startTimeDecimal",
          "type": "number"
        },
        {
          "name": "endTimeDisplay",
          "type": "text"
        },
        {
          "name": "endTimeDecimal",
          "type": "number"
        },
        {
          "name": "max",
          "type": "number"
        },
        {
          "name": "instructor_firstname",
          "type": "text"
        },
        {
          "name": "instructor_lastname",
          "type": "text"
        },
        {
          "name": "instructorid",
          "type": "number"
        },
        {
          "name": "enrolcount",
          "type": "number"
        },
        {
          "name": "enrol_active",
          "type": "number"
        },
        {
          "name": "enrol_makeup",
          "type": "number"
        },
        {
          "name": "enrol_trial",
          "type": "number"
        },
        {
          "name": "enrol_waitlist",
          "type": "number"
        },
        {
          "name": "enrol_casual",
          "type": "number"
        },
        {
          "name": "slots_avail",
          "type": "number"
        },
        {
          "name": "active_enrols",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "number",
              "name": "enrolmentType"
            },
            {
              "type": "date",
              "name": "dropDate"
            },
            {
              "type": "boolean",
              "name": "isValid"
            },
            {
              "type": "number",
              "name": "student"
            },
            {
              "type": "date",
              "name": "startDate"
            },
            {
              "type": "number",
              "name": "classId"
            },
            {
              "type": "text",
              "name": "dropReason"
            },
            {
              "type": "text",
              "name": "firstName"
            },
            {
              "type": "text",
              "name": "lastName"
            },
            {
              "type": "date",
              "name": "dob"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "dd_classdetails_searchenrol": {
      "meta": [
        {
          "name": "dates",
          "type": "array"
        }
      ],
      "outputType": "text"
    },
    "localStorage": [
      {
        "type": "object",
        "name": "class"
      },
      {
        "type": "object",
        "name": "student"
      }
    ],
    "var_enroltype": {
      "meta": null,
      "outputType": "boolean"
    },
    "dd_uw_classDetails": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "classLevel",
          "type": "number"
        },
        {
          "name": "day_name",
          "type": "text"
        },
        {
          "name": "day_int",
          "type": "number"
        },
        {
          "name": "startdate",
          "type": "date"
        },
        {
          "name": "enddate",
          "type": "date"
        },
        {
          "name": "classType",
          "type": "number"
        },
        {
          "name": "startTimeDisplay",
          "type": "text"
        },
        {
          "name": "startTimeDecimal",
          "type": "number"
        },
        {
          "name": "endTimeDisplay",
          "type": "text"
        },
        {
          "name": "endTimeDecimal",
          "type": "number"
        },
        {
          "name": "max",
          "type": "number"
        },
        {
          "name": "instructor_firstname",
          "type": "text"
        },
        {
          "name": "instructor_lastname",
          "type": "text"
        },
        {
          "name": "instructorid",
          "type": "number"
        },
        {
          "name": "enrolcount",
          "type": "number"
        },
        {
          "name": "enrol_active",
          "type": "number"
        },
        {
          "name": "enrol_makeup",
          "type": "number"
        },
        {
          "name": "enrol_trial",
          "type": "number"
        },
        {
          "name": "enrol_waitlist",
          "type": "number"
        },
        {
          "name": "enrol_casual",
          "type": "number"
        },
        {
          "name": "slots_avail",
          "type": "number"
        },
        {
          "name": "active_enrols",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "number",
              "name": "enrolmentType"
            },
            {
              "type": "date",
              "name": "dropDate"
            },
            {
              "type": "boolean",
              "name": "isValid"
            },
            {
              "type": "number",
              "name": "student"
            },
            {
              "type": "date",
              "name": "startDate"
            },
            {
              "type": "number",
              "name": "classId"
            },
            {
              "type": "text",
              "name": "dropReason"
            },
            {
              "type": "text",
              "name": "firstName"
            },
            {
              "type": "text",
              "name": "lastName"
            },
            {
              "type": "date",
              "name": "dob"
            },
            {
              "type": "number",
              "name": "family"
            }
          ]
        },
        {
          "name": "trial_enrols",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "number",
              "name": "enrolmentType"
            },
            {
              "type": "date",
              "name": "dropDate"
            },
            {
              "type": "boolean",
              "name": "isValid"
            },
            {
              "type": "number",
              "name": "student"
            },
            {
              "type": "date",
              "name": "startDate"
            },
            {
              "type": "number",
              "name": "classId"
            },
            {
              "type": "text",
              "name": "dropReason"
            },
            {
              "type": "text",
              "name": "firstName"
            },
            {
              "type": "text",
              "name": "lastName"
            },
            {
              "type": "date",
              "name": "dob"
            },
            {
              "type": "number",
              "name": "family"
            }
          ]
        },
        {
          "name": "makeup_enrols",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "number",
              "name": "enrolmentType"
            },
            {
              "type": "date",
              "name": "dropDate"
            },
            {
              "type": "boolean",
              "name": "isValid"
            },
            {
              "type": "number",
              "name": "student"
            },
            {
              "type": "date",
              "name": "startDate"
            },
            {
              "type": "number",
              "name": "classId"
            },
            {
              "type": "text",
              "name": "dropReason"
            },
            {
              "type": "text",
              "name": "firstName"
            },
            {
              "type": "text",
              "name": "lastName"
            },
            {
              "type": "date",
              "name": "dob"
            },
            {
              "type": "number",
              "name": "family"
            }
          ]
        },
        {
          "name": "casual_enrols",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "number",
              "name": "enrolmentType"
            },
            {
              "type": "date",
              "name": "dropDate"
            },
            {
              "type": "boolean",
              "name": "isValid"
            },
            {
              "type": "number",
              "name": "student"
            },
            {
              "type": "date",
              "name": "startDate"
            },
            {
              "type": "number",
              "name": "classId"
            },
            {
              "type": "text",
              "name": "dropReason"
            },
            {
              "type": "text",
              "name": "firstName"
            },
            {
              "type": "text",
              "name": "lastName"
            },
            {
              "type": "date",
              "name": "dob"
            },
            {
              "type": "number",
              "name": "family"
            }
          ]
        },
        {
          "name": "wait_enrols",
          "type": "array",
          "sub": [
            {
              "type": "number",
              "name": "id"
            },
            {
              "type": "number",
              "name": "studentid"
            },
            {
              "type": "date",
              "name": "request_date"
            },
            {
              "type": "date",
              "name": "fulfil_date"
            },
            {
              "type": "number",
              "name": "classlevel"
            },
            {
              "type": "number",
              "name": "starttimedec"
            },
            {
              "type": "number",
              "name": "endtimedec"
            },
            {
              "type": "number",
              "name": "dayint"
            },
            {
              "type": "number",
              "name": "instructor"
            },
            {
              "type": "text",
              "name": "notes"
            },
            {
              "type": "text",
              "name": "firstName"
            },
            {
              "type": "text",
              "name": "lastName"
            },
            {
              "type": "date",
              "name": "dob"
            }
          ]
        },
        {
          "name": "total_enrols",
          "type": "text",
          "sub": []
        }
      ],
      "outputType": "array"
    },
    "dd_uw_waitlistDetails": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "number",
          "name": "studentid"
        },
        {
          "type": "date",
          "name": "request_date"
        },
        {
          "type": "date",
          "name": "fulfil_date"
        },
        {
          "type": "number",
          "name": "classlevel"
        },
        {
          "type": "number",
          "name": "starttimedec"
        },
        {
          "type": "number",
          "name": "endtimedec"
        },
        {
          "type": "number",
          "name": "dayint"
        },
        {
          "type": "number",
          "name": "instructor"
        },
        {
          "type": "text",
          "name": "notes"
        },
        {
          "type": "text",
          "name": "firstName"
        },
        {
          "type": "text",
          "name": "lastName"
        },
        {
          "type": "date",
          "name": "dob"
        }
      ],
      "outputType": "array"
    },
    "var_classid": {
      "meta": null,
      "outputType": "number"
    },
    "var_editclass_dirtyform": {
      "meta": null,
      "outputType": "boolean"
    },
    "rp_makeupavail_disp": {
      "meta": [
        {
          "name": "dates",
          "type": "array"
        }
      ],
      "outputType": "text"
    },
    "tuitioncharge_existsChargeAhead": [
      {
        "name": "$param",
        "type": "object",
        "sub": [
          {
            "type": "date",
            "name": "startdate"
          },
          {
            "type": "object",
            "name": "class"
          },
          {
            "type": "number",
            "name": "familyid"
          },
          {
            "type": "date",
            "name": "timenow"
          },
          {
            "type": "object",
            "name": "student"
          },
          {
            "type": "number",
            "name": "enroltype"
          }
        ]
      },
      {
        "name": "checkTuitionCharges",
        "type": "object",
        "sub": [
          {
            "name": "data",
            "type": "object",
            "sub": [
              {
                "name": "chargeahead",
                "type": "text",
                "sub": [
                  {
                    "name": "dates",
                    "type": "array"
                  }
                ]
              },
              {
                "name": "chargeDetails",
                "type": "text",
                "sub": []
              }
            ]
          },
          {
            "name": "state",
            "type": "object",
            "sub": [
              {
                "name": "executing",
                "type": "boolean"
              },
              {
                "name": "uploading",
                "type": "boolean"
              },
              {
                "name": "processing",
                "type": "boolean"
              },
              {
                "name": "downloading",
                "type": "boolean"
              }
            ]
          },
          {
            "name": "uploadProgress",
            "type": "object",
            "sub": [
              {
                "name": "position",
                "type": "number"
              },
              {
                "name": "total",
                "type": "number"
              },
              {
                "name": "percent",
                "type": "number"
              }
            ]
          },
          {
            "name": "downloadProgress",
            "type": "object",
            "sub": [
              {
                "name": "position",
                "type": "number"
              },
              {
                "name": "total",
                "type": "number"
              },
              {
                "name": "percent",
                "type": "number"
              }
            ]
          },
          {
            "name": "lastError",
            "type": "object",
            "sub": [
              {
                "name": "status",
                "type": "number"
              },
              {
                "name": "message",
                "type": "text"
              },
              {
                "name": "response",
                "type": "text"
              }
            ]
          },
          {
            "name": "status",
            "type": "number"
          }
        ]
      }
    ],
    "rp_ne_chargecalc_dates": {
      "meta": [
        {
          "name": "dates",
          "type": "array"
        }
      ],
      "outputType": "text"
    }
  },
  "_classFilterSidebar": {
    "rp_selectedTimes2": {
      "meta": null,
      "outputType": "array"
    },
    "sessionStorage": [
      {
        "type": "array",
        "name": "days"
      }
    ],
    "arr_dayFilter": {
      "meta": null,
      "outputType": "array"
    }
  },
  "_classesSidebar": {
    "sessionStorage": [
      {
        "type": "array",
        "name": "days"
      },
      {
        "type": "array",
        "name": "dayGet"
      },
      {
        "type": "array",
        "name": "times"
      },
      {
        "type": "array",
        "name": "timeGet"
      },
      {
        "type": "array",
        "name": "levels"
      },
      {
        "type": "array",
        "name": "levelGet"
      },
      {
        "type": "array",
        "name": "instructors"
      },
      {
        "type": "array",
        "name": "instructorGet"
      }
    ],
    "arr_dayGet": {
      "meta": null,
      "outputType": "array"
    },
    "arr_dayFilter": {
      "meta": null,
      "outputType": "array"
    },
    "arr_timeGet": {
      "meta": null,
      "outputType": "array"
    },
    "arr_levelGet": {
      "meta": null,
      "outputType": "array"
    },
    "arr_instructorGet": {
      "meta": null,
      "outputType": "array"
    },
    "arr_instructorFilter": {
      "meta": null,
      "outputType": "array"
    },
    "arr_levelFilter": {
      "meta": null,
      "outputType": "array"
    },
    "arr_timeFilter": {
      "meta": null,
      "outputType": "array"
    }
  },
  "familiesSideFilter": {
    "sessionStorage": [
      {
        "type": "text",
        "name": "textsearch"
      }
    ]
  },
  "newFamilyPayment": {
    "query": [
      {
        "type": "text",
        "name": "familyid"
      },
      {
        "type": "number",
        "name": "payamount"
      },
      {
        "type": "array",
        "name": "pay_chargeid"
      },
      {
        "type": "array",
        "name": "pay_chargeremaining"
      },
      {
        "type": "array",
        "name": "pay_chargestudentid"
      }
    ],
    "guardianRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "primaryGuardian",
          "type": "number"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "relationship",
          "type": "number"
        },
        {
          "name": "phoneNumbers",
          "type": "text"
        },
        {
          "name": "email",
          "type": "text"
        },
        {
          "name": "emailAddresses",
          "type": "text"
        },
        {
          "name": "plusEmails",
          "type": "number"
        }
      ],
      "outputType": "array"
    },
    "studentRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "text"
        },
        {
          "name": "chargeDateFrom",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "text"
        },
        {
          "name": "dueDate",
          "type": "text"
        },
        {
          "name": "chargeType",
          "type": "text"
        },
        {
          "name": "totalPaid",
          "type": "number"
        },
        {
          "name": "totalOwing",
          "type": "number"
        },
        {
          "name": "owingLineItems",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "startofweek",
              "type": "text"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "remaining",
              "type": "text"
            },
            {
              "name": "totalPaid",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "charges": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "text"
        },
        {
          "name": "chargeDateFrom",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "text"
        },
        {
          "name": "dueDate",
          "type": "text"
        },
        {
          "name": "chargeType",
          "type": "text"
        },
        {
          "name": "totalPaid",
          "type": "number"
        },
        {
          "name": "owingLineItems",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "startofweek",
              "type": "text"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "remaining",
              "type": "text"
            },
            {
              "name": "totalPaid",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "rp_owingCharge": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "text"
        },
        {
          "name": "chargeDateFrom",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "text"
        },
        {
          "name": "dueDate",
          "type": "text"
        },
        {
          "name": "chargeType",
          "type": "text"
        },
        {
          "name": "totalPaid",
          "type": "number"
        },
        {
          "name": "owingLineItems",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "startofweek",
              "type": "text"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "remaining",
              "type": "text"
            },
            {
              "name": "totalPaid",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "repeat1": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "text"
        },
        {
          "name": "chargeDateFrom",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "text"
        },
        {
          "name": "dueDate",
          "type": "text"
        },
        {
          "name": "chargeType",
          "type": "text"
        },
        {
          "name": "totalPaid",
          "type": "number"
        },
        {
          "name": "totalOwing",
          "type": "number"
        },
        {
          "name": "owingLineItems",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "startofweek",
              "type": "text"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "remaining",
              "type": "text"
            },
            {
              "name": "totalPaid",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "sessionStorage": [
      {
        "type": "number",
        "name": "flatpay_tuition_payamount"
      }
    ],
    "chargeRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "text"
        },
        {
          "name": "chargeDateFrom",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "text"
        },
        {
          "name": "dueDate",
          "type": "text"
        },
        {
          "name": "chargeType",
          "type": "text"
        },
        {
          "name": "totalPaid",
          "type": "number"
        },
        {
          "name": "totalOwing",
          "type": "number"
        },
        {
          "name": "owingLineItems",
          "type": "array",
          "sub": [
            {
              "name": "id",
              "type": "number"
            },
            {
              "name": "studentid",
              "type": "number"
            },
            {
              "name": "startofweek",
              "type": "text"
            },
            {
              "name": "enr_grandTotal",
              "type": "number"
            },
            {
              "name": "enrolid",
              "type": "number"
            },
            {
              "name": "remaining",
              "type": "text"
            },
            {
              "name": "totalPaid",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "studentLinesRepeat": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "chargeAmount",
          "type": "number"
        },
        {
          "name": "chargeDateTo",
          "type": "text"
        },
        {
          "name": "chargeDateFrom",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "reference",
          "type": "text"
        },
        {
          "name": "chargeFor",
          "type": "text"
        },
        {
          "name": "dueDate",
          "type": "text"
        },
        {
          "name": "chargeType",
          "type": "text"
        },
        {
          "name": "totalPaid",
          "type": "number"
        },
        {
          "name": "totalOwing",
          "type": "number"
        },
        {
          "name": "classDetails",
          "type": "object",
          "sub": [
            {
              "name": "startTimeDisplay",
              "type": "text"
            },
            {
              "name": "instructorFirst",
              "type": "text"
            },
            {
              "name": "instructorLast",
              "type": "text"
            },
            {
              "name": "levelName",
              "type": "text"
            },
            {
              "name": "dayName",
              "type": "text"
            }
          ]
        }
      ],
      "outputType": "array"
    },
    "selectedChargesStore": [
      {
        "type": "text",
        "name": "chargeid"
      },
      {
        "type": "number",
        "name": "remaining"
      },
      {
        "type": "number",
        "name": "stid"
      }
    ],
    "var_payType": {
      "meta": null,
      "outputType": "boolean"
    },
    "var_flatPayment": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "chargeid"
        },
        {
          "type": "number",
          "name": "remaining"
        },
        {
          "type": "number",
          "name": "stid"
        }
      ],
      "outputType": "array"
    },
    "var_chargePayment": {
      "outputType": "text"
    },
    "rp_pi_selectedcharges": {
      "meta": null,
      "outputType": "array"
    }
  },
  "confirmChargePayment": {
    "repeat1": {
      "meta": [
        {
          "name": "$id",
          "type": "number"
        },
        {
          "type": "text",
          "name": "chargeid"
        },
        {
          "type": "number",
          "name": "remaining"
        },
        {
          "type": "number",
          "name": "studentid"
        }
      ],
      "outputType": "array"
    },
    "selectedChargesStore": [
      {
        "type": "text",
        "name": "chargeid"
      },
      {
        "type": "number",
        "name": "remaining"
      },
      {
        "type": "number",
        "name": "stid"
      }
    ],
    "rp_hiddenChargeInputs": {
      "meta": [
        {
          "type": "number",
          "name": "uuid"
        },
        {
          "type": "number",
          "name": "chargeid"
        },
        {
          "type": "number",
          "name": "paymenttotal"
        },
        {
          "type": "number",
          "name": "chargetotal"
        }
      ],
      "outputType": "array"
    },
    "localStorage": [
      {
        "type": "text",
        "name": "paymentid"
      }
    ],
    "sessionStorage": [
      {
        "type": "number",
        "name": "paymentidentity"
      }
    ]
  },
  "payment_success": {
    "sessionStorage": [
      {
        "type": "number",
        "name": "paymentidentity"
      }
    ],
    "record": {
      "meta": [
        {
          "name": "id",
          "type": "number"
        },
        {
          "name": "startofweek",
          "type": "date"
        },
        {
          "name": "studentid",
          "type": "number"
        },
        {
          "name": "classDate",
          "type": "date"
        },
        {
          "name": "enr_grandTotal",
          "type": "number"
        },
        {
          "name": "paymentid",
          "type": "number"
        },
        {
          "name": "levelname",
          "type": "text"
        },
        {
          "name": "instructorFirst",
          "type": "text"
        },
        {
          "name": "instructorLast",
          "type": "text"
        },
        {
          "name": "classStart",
          "type": "text"
        },
        {
          "name": "dayname",
          "type": "text"
        },
        {
          "name": "studentfirst",
          "type": "text"
        },
        {
          "name": "studentlast",
          "type": "text"
        },
        {
          "name": "family",
          "type": "number"
        },
        {
          "name": "total_enrpaid",
          "type": "number"
        },
        {
          "name": "remainingBalance",
          "type": "number"
        }
      ],
      "outputType": "array"
    }
  },
  "layoutMain": {
    "repeat1": {
      "meta": [
        {
          "name": "id",
          "type": "text"
        },
        {
          "name": "firstName",
          "type": "text"
        },
        {
          "name": "lastName",
          "type": "text"
        },
        {
          "name": "phone",
          "type": "text"
        },
        {
          "name": "email",
          "type": "text"
        },
        {
          "name": "staffTypes",
          "type": "text"
        }
      ],
      "outputType": "array"
    }
  },
  "create_family": {
    "guard_datastore": [
      {
        "type": "text",
        "name": "firstname"
      },
      {
        "type": "text",
        "name": "lastname"
      },
      {
        "type": "number",
        "name": "relationship"
      },
      {
        "type": "array",
        "name": "emails",
        "sub": [
          {
            "type": "text",
            "name": "address"
          },
          {
            "type": "text",
            "name": "type"
          }
        ]
      },
      {
        "type": "array",
        "name": "phones",
        "sub": [
          {
            "type": "text",
            "name": "phone"
          },
          {
            "type": "text",
            "name": "type"
          }
        ]
      }
    ],
    "phone_holding": [
      {
        "type": "text",
        "name": "phone"
      },
      {
        "type": "text",
        "name": "type"
      }
    ],
    "email_holding": [
      {
        "type": "text",
        "name": "address"
      },
      {
        "type": "text",
        "name": "type"
      }
    ]
  },
  "student_details": {
    "repeat1": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "text",
          "name": "firstName"
        },
        {
          "type": "text",
          "name": "lastName"
        },
        {
          "type": "date",
          "name": "dob"
        },
        {
          "type": "text",
          "name": "rollSheetComments"
        },
        {
          "type": "text",
          "name": "rollSheetMedical"
        },
        {
          "type": "text",
          "name": "additionalMedical"
        },
        {
          "type": "number",
          "name": "family"
        },
        {
          "type": "text",
          "name": "gender"
        },
        {
          "type": "number",
          "name": "level"
        },
        {
          "type": "text",
          "name": "age"
        }
      ],
      "outputType": "array"
    },
    "dd_studentNote": {
      "meta": [
        {
          "type": "number",
          "name": "id"
        },
        {
          "type": "text",
          "name": "content"
        },
        {
          "type": "number",
          "name": "student"
        },
        {
          "type": "number",
          "name": "priority"
        },
        {
          "type": "text",
          "name": "subject"
        },
        {
          "type": "text",
          "name": "status"
        },
        {
          "type": "date",
          "name": "dated_created"
        },
        {
          "type": "date",
          "name": "date_closed"
        },
        {
          "type": "number",
          "name": "staff_created"
        },
        {
          "type": "number",
          "name": "staff_closed"
        }
      ],
      "outputType": "array"
    }
  },
  "classesCalendar": {
    "rp_weekDays": {
      "meta": null,
      "outputType": "text"
    },
    "rp_times": {
      "meta": [
        {
          "name": "$index",
          "type": "number"
        },
        {
          "name": "$key",
          "type": "text"
        },
        {
          "name": "$value",
          "type": "object"
        },
        {
          "name": "calData",
          "type": "array"
        }
      ],
      "outputType": "text"
    },
    "rp_classes": {
      "outputType": "boolean"
    },
    "var_timeslot": {
      "meta": null,
      "outputType": "object"
    },
    "daysrepeat": {
      "outputType": "text"
    },
    "filter_store": [
      {
        "type": "array",
        "name": "filter_days"
      },
      {
        "type": "array",
        "name": "filter_instructors"
      },
      {
        "type": "array",
        "name": "filter_times",
        "sub": [
          {
            "type": "text",
            "name": "display"
          },
          {
            "type": "text",
            "name": "decimal"
          }
        ]
      },
      {
        "type": "array",
        "name": "filter_levels"
      }
    ],
    "rp_selected_timefilters": {
      "meta": null,
      "outputType": "array"
    },
    "localStorage": [
      {
        "type": "array",
        "name": "filter_times"
      },
      {
        "type": "array",
        "name": "filter_days"
      },
      {
        "type": "array",
        "name": "filter_levels"
      },
      {
        "type": "array",
        "name": "filter_instructors"
      }
    ],
    "arr_timesfilter": {
      "meta": null,
      "outputType": "array"
    },
    "rp_daysheader": {
      "meta": [
        {
          "name": "calData",
          "type": "array"
        }
      ],
      "outputType": "text"
    }
  }
});
