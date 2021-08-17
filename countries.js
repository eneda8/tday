const countries = [
    {
        name: "Unites States of America",
        flag: "/images/flags/US.png"
    },
    {
        name: "Andorra",
        flag: "/images/flags/AD.png"
    },
    {
        name: "United Arab Emirates",
        flag: "/images/flags/AE.png"
    },
    {
        name: "Afghanistan",
        flag: "/images/flags/AF.png"
    },
    {
        name: "Antigua & Barbuda",
        flag: "/images/flags/.png"
    },
    {
        name: "Anguila",
        flag: "/images/flags/AI.png"
    },
    {
        name: "Albania",
        flag: "/images/flags/AL.png"
    },
    {
        name: "Armenia",
        flag: "/images/flags/AM.png"
    },
    {
        name: "Angola",
        flag: "/images/flags/AO.png"
    },
    {
        name: "Argentina",
        flag: "/images/flags/AR.png"
    },
    {
        name: "American Samoa",
        flag: "/images/flags/AS.png"
    },
    {
        name: "Austria",
        flag: "/images/flags/AT.png"
    },
    {
        name: "Australia",
        flag: "/images/flags/AU.png"
    },
    {
        name: "Aruba",
        flag: "/images/flags/AW.png"
    },
    {
        name: "Åland Islands",
        flag: "/images/flags/AX.png"
    },
    {
        name: "Azerbaijan",
        flag: "/images/flags/AZ.png"
    },
    {
        name: "Bosnia & Herzegovina",
        flag: "/images/flags/BA.png"
    },
    {
        name: "Barbados",
        flag: "/images/flags/BB.png"
    },
    {
        name: "Bangladesh",
        flag: "/images/flags/BD.png"
    },
    {
        name: "Belgium",
        flag: "/images/flags/BE.png"
    },
    {
        name: "Burkina Faso",
        flag: "/images/flags/BF.png"
    },
    {
        name: "Bulgaria",
        flag: "/images/flags/BG.png"
    },
    {
        name: "Bahrain",
        flag: "/images/flags/BH.png"
    },
    {
        name: "Burundi",
        flag: "/images/flags/BI.png"
    },
    {
        name: "Benin",
        flag: "/images/flags/BJ.png"
    },
    {
        name: "St. Barthélemy",
        flag: "/images/flags/BL.png"
    },
    {
        name: "Bermuda",
        flag: "/images/flags/BM.png"
    },
    {
        name: "Brunei",
        flag: "/images/flags/BN.png"
    },
    {
        name: "Bolivia",
        flag: "/images/flags/BO.png"
    },
    {
        name: "Caribbean Netherlands",
        flag: "/images/flags/BQ.png"
    },
    {
        name: "Brazil",
        flag: "/images/flags/BR.png"
    },
    {
        name: "Bahamas",
        flag: "/images/flags/BS.png"
    },
    {
        name: "Bhutan",
        flag: "/images/flags/BT.png"
    },
    {
        name: "Bouvet Island",
        flag: "/images/flags/BV.png"
    },
    {
        name: "Botswana",
        flag: "/images/flags/BW.png"
    },
    {
        name: "Belarus",
        flag: "/images/flags/BY.png"
    },
    {
        name: "Belize",
        flag: "/images/flags/BZ.png"
    },
    {
        name: "Canada",
        flag: "/images/flags/CA.png"
    },
    {
        name: "Cocos (Keeling) Islands",
        flag: "/images/flags/CC.png"
    },
    {
        name: "Congo - Kinshasa",
        flag: "/images/flags/CD.png"
    },
    {
        name: "Central African Republic",
        flag: "/images/flags/CF.png"
    },
    {
        name: "Congo Brazzaville",
        flag: "/images/flags/CG.png"
    },
    {
        name: "Côte d’Ivoire",
        flag: "/images/flags/CI.png"
    },
    {
        name: "Cook Islands",
        flag: "/images/flags/CK.png"
    },
    {
        name: "Chile",
        flag: "/images/flags/CL.png"
    },
    {
        name: "Cameroon",
        flag: "/images/flags/CM.png"
    },
    {
        name: "China",
        flag: "/images/flags/CN.png"
    },
    {
        name: "Colombia",
        flag: "/images/flags/CO.png"
    },
    {
        name: "Clipperton Island",
        flag: "/images/flags/BL.png"
    },
    {
        name: "Costa Rica",
        flag: "/images/flags/CR.png"
    },
    {
        name: "Cuba",
        flag: "/images/flags/CU.png"
    },
    {
        name: "Cape Verde",
        flag: "/images/flags/CV.png"
    },
    {
        name: "Curaçao",
        flag: "/images/flags/CW.png"
    },
    {
        name: "Christmas Island",
        flag: "/images/flags/CX.png"
    },
    {
        name: "Cyprus",
        flag: "/images/flags/CY.png"
    },
    {
        name: "Czechia",
        flag: "/images/flags/CZ.png"
    },
    {
        name: "Germany",
        flag: "/images/flags/DE.png"
    },
    {
        name: "Djibouti",
        flag: "/images/flags/DJ.png"
    },
    {
        name: "Denmark",
        flag: "/images/flags/DK.png"
    },
    {
        name: "Dominica",
        flag: "/images/flags/DM.png"
    },
    {
        name: "Dominican Republic",
        flag: "/images/flags/DO.png"
    },
    {
        name: "Algeria",
        flag: "/images/flags/DZ.png"
    },
    {
        name: "Ceuta & Melilla",
        flag: "/images/flags/ES.png"
    },
    {
        name: "Ecuador",
        flag: "/images/flags/EC.png"
    },
    {
        name: "Estonia",
        flag: "/images/flags/EE.png"
    },
    {
        name: "Egypt",
        flag: "/images/flags/EG.png"
    },
    {
        name: "Eritrea",
        flag: "/images/flags/ER.png"
    },
    {
        name: "Spain",
        flag: "/images/flags/ES.png"
    },
    {
        name: "Ethiopia",
        flag: "/images/flags/ET.png"
    },
    {
        name: "Finland",
        flag: "/images/flags/FI.png"
    },
    {
        name: "Fiji",
        flag: "/images/flags/FJ.png"
    },
    {
        name: "Falkland Islands",
        flag: "/images/flags/FK.png"
    },
    {
        name: "Micronesia",
        flag: "/images/flags/FM.png"
    },
    {
        name: "Faroe Islands",
        flag: "/images/flags/FO.png"
    },
    {
        name: "France",
        flag: "/images/flags/FR.png"
    },
    {
        name: "Gabon",
        flag: "/images/flags/GA.png"
    },
    {
        name: "United Kingdom",
        flag: "/images/flags/GB.png"
    },
    {
        name: "Grenada",
        flag: "/images/flags/GD.png"
    },
    {
        name: "Georgia",
        flag: "/images/flags/GE.png"
    },
    {
        name: "French Guiana",
        flag: "/images/flags/GF.png"
    },
    {
        name: "Guernsey",
        flag: "/images/flags/GG.png"
    },
    {
        name: "Ghana",
        flag: "/images/flags/GH.png"
    },
    {
        name: "Gibraltar",
        flag: "/images/flags/GI.png"
    },
    {
        name: "Greenland",
        flag: "/images/flags/GL.png"
    },
    {
        name: "Gambia",
        flag: "/images/flags/GM.png"
    },
    {
        name: "Guinea",
        flag: "/images/flags/GN.png"
    },
    {
        name: "Guadeloupe",
        flag: "/images/flags/GP.png"
    },
    {
        name: "Equatorial Guinea",
        flag: "/images/flags/GQ.png"
    },
    {
        name: "Greece",
        flag: "/images/flags/GR.png"
    },
    {
        name: "South Georgia & South Sandwich Islands",
        flag: "/images/flags/GS.png"
    },
    {
        name: "Guatemala",
        flag: "/images/flags/GT.png"
    },
    {
        name: "Guam",
        flag: "/images/flags/GU.png"
    },
    {
        name: "Guinea-Bissau",
        flag: "/images/flags/GW.png"
    },
    {
        name: "Guyana",
        flag: "/images/flags/GY.png"
    },
    {
        name: "Hong Kong",
        flag: "/images/flags/HK.png"
    },
    {
        name: "Honduras",
        flag: "/images/flags/HN.png"
    },
    {
        name: "Croatia",
        flag: "/images/flags/HR.png"
    },
    {
        name: "Haiti",
        flag: "/images/flags/HT.png"
    },
    {
        name: "Hungary",
        flag: "/images/flags/HU.png"
    },
    {
        name: "Indonesia",
        flag: "/images/flags/ID.png"
    },
    {
        name: "Ireland",
        flag: "/images/flags/IE.png"
    },
    {
        name: "Israel",
        flag: "/images/flags/IL.png"
    },
    {
        name: "Isle of Man",
        flag: "/images/flags/IM.png"
    },
    {
        name: "India",
        flag: "/images/flags/IN.png"
    },
    {
        name: "British Indian Ocean Territory",
        flag: "/images/flags/IO.png"
    },
    {
        name: "Iraq",
        flag: "/images/flags/IQ.png"
    },
    {
        name: "Iran",
        flag: "/images/flags/IR.png"
    },
    {
        name: "Iceland",
        flag: "/images/flags/IS.png"
    },
    {
        name: "Italy",
        flag: "/images/flags/IT.png"
    },
    {
        name: "Jersey",
        flag: "/images/flags/JE.png"
    },
    {
        name: "Jamaica",
        flag: "/images/flags/JM.png"
    },
    {
        name: "Jordan",
        flag: "/images/flags/JO.png"
    },
    {
        name: "Japan",
        flag: "/images/flags/JP.png"
    },
    {
        name: "Kenya",
        flag: "/images/flags/KE.png"
    },
    {
        name: "Kyrgyzstan",
        flag: "/images/flags/KG.png"
    },
    {
        name: "Cambodia",
        flag: "/images/flags/KH.png"
    },
    {
        name: "Kiribati",
        flag: "/images/flags/KI.png"
    },
    {
        name: "Comoros",
        flag: "/images/flags/KM.png"
    },
    {
        name: "St. Kitts & Nevis",
        flag: "/images/flags/.png"
    },
    {
        name: "North Korea",
        flag: "/images/flags/KP.png"
    },
    {
        name: "South Korea",
        flag: "/images/flags/KR.png"
    },
    {
        name: "Kuwait",
        flag: "/images/flags/KW.png"
    },
    {
        name: "Cayman Islands",
        flag: "/images/flags/KY.png"
    },
    {
        name: "Kazakhstan",
        flag: "/images/flags/KZ.png"
    },
    {
        name: "Laos",
        flag: "/images/flags/LA.png"
    },
    {
        name: "Lebanon",
        flag: "/images/flags/LB.png"
    },
    {
        name: "St. Lucia",
        flag: "/images/flags/LC.png"
    },
    {
        name: "Liechtenstein",
        flag: "/images/flags/LI.png"
    },
    {
        name: "Sri Lanka",
        flag: "/images/flags/LK.png"
    },
    {
        name: "Liberia",
        flag: "/images/flags/LR.png"
    },
    {
        name: "Lesotho",
        flag: "/images/flags/LS.png"
    },
    {
        name: "Lithuania",
        flag: "/images/flags/LT.png"
    },
    {
        name: "Luxembourg",
        flag: "/images/flags/LU.png"
    },
    {
        name: "Latvia",
        flag: "/images/flags/LV.png"
    },
    {
        name: "Libya",
        flag: "/images/flags/LY.png"
    },
    {
        name: "Morocco",
        flag: "/images/flags/MA.png"
    },
    {
        name: "Monaco",
        flag: "/images/flags/MC.png"
    },
    {
        name: "Moldova",
        flag: "/images/flags/MD.png"
    },
    {
        name: "Montenegro",
        flag: "/images/flags/ME.png"
    },
    {
        name: "Madagascar",
        flag: "/images/flags/MG.png"
    },
    {
        name: "Marshall Islands",
        flag: "/images/flags/MH.png"
    },
    {
        name: "North Macedonia",
        flag: "/images/flags/MK.png"
    },
    {
        name: "Mali",
        flag: "/images/flags/ML.png"
    },
    {
        name: "Myanmar(Burma)",
        flag: "/images/flags/MM.png"
    },
    {
        name: "Mongolia",
        flag: "/images/flags/MN.png"
    },
    {
        name: "Macao Sar China",
        flag: "/images/flags/MO.png"
    },
    {
        name: "Northern Mariana Islands",
        flag: "/images/flags/MP.png"
    },
    {
        name: "Martinique",
        flag: "/images/flags/MQ.png"
    },
    {
        name: "Mauritania",
        flag: "/images/flags/MR.png"
    },
    {
        name: "Montserrat",
        flag: "/images/flags/MS.png"
    },
    {
        name: "Malta",
        flag: "/images/flags/MT.png"
    },
    {
        name: "Mauritius",
        flag: "/images/flags/MU.png"
    },
    {
        name: "Maldives",
        flag: "/images/flags/MV.png"
    },
    {
        name: "Malawi",
        flag: "/images/flags/MW.png"
    },
    {
        name: "Mexico",
        flag: "/images/flags/MX.png"
    },
    {
        name: "Malaysia",
        flag: "/images/flags/MY.png"
    },
    {
        name: "Mozambique",
        flag: "/images/flags/MZ.png"
    },
    {
        name: "Namibia",
        flag: "/images/flags/NA.png"
    },
    {
        name: "New Caledonia",
        flag: "/images/flags/NC.png"
    },
    {
        name: "Niger",
        flag: "/images/flags/NE.png"
    },
    {
        name: "Norfolk Island",
        flag: "/images/flags/NF.png"
    },
    {
        name: "Nigeria",
        flag: "/images/flags/NG.png"
    },
    {
        name: "Nicaragua",
        flag: "/images/flags/NI.png"
    },
    {
        name: "Netherlands",
        flag: "/images/flags/NL.png"
    },
    {
        name: "Norway",
        flag: "/images/flags/NO.png"
    },
    {
        name: "Nepal",
        flag: "/images/flags/NP.png"
    },
    {
        name: "Nauru",
        flag: "/images/flags/NR.png"
    },
    {
        name: "Niue",
        flag: "/images/flags/NU.png"
    },
    {
        name: "New Zealand",
        flag: "/images/flags/NZ.png"
    },
    {
        name: "Oman",
        flag: "/images/flags/OM.png"
    },
    {
        name: "Panama",
        flag: "/images/flags/PA.png"
    },
    {
        name: "Peru",
        flag: "/images/flags/PE.png"
    },
    {
        name: "French Polynesia",
        flag: "/images/flags/PF.png"
    },
    {
        name: "Papua New Guinea",
        flag: "/images/flags/PG.png"
    },
    {
        name: "Philippines",
        flag: "/images/flags/PH.png"
    },
    {
        name: "Pakistan",
        flag: "/images/flags/PK.png"
    },
    {
        name: "Poland",
        flag: "/images/flags/PL.png"
    },
    {
        name: "St. Pierre & Miquelon",
        flag: "/images/flags/PM.png"
    },
    {
        name: "Pitcairn Islands",
        flag: "/images/flags/PN.png"
    },
    {
        name: "Puerto Rico",
        flag: "/images/flags/PR.png"
    },
    {
        name: "Palestine",
        flag: "/images/flags/PS.png"
    },
    {
        name: "Portugal",
        flag: "/images/flags/PT.png"
    },
    {
        name: "Palau",
        flag: "/images/flags/PW.png"
    },
    {
        name: "Paraguay",
        flag: "/images/flags/PY.png"
    },
    {
        name: "Qatar",
        flag: "/images/flags/QA.png"
    },
    {
        name: "Réunion",
        flag: "/images/flags/RE.png"
    },
    {
        name: "Romania",
        flag: "/images/flags/RO.png"
    },
    {
        name: "Serbia",
        flag: "/images/flags/RS.png"
    },
    {
        name: "Russia",
        flag: "/images/flags/RU.png"
    },
    {
        name: "Rwanda",
        flag: "/images/flags/RW.png"
    },
    {
        name: "Saudi Arabia",
        flag: "/images/flags/SA.png"
    },
    {
        name: "Solomon Islands",
        flag: "/images/flags/SB.png"
    },
    {
        name: "Seychelles",
        flag: "/images/flags/SC.png"
    },
    {
        name: "Sudan",
        flag: "/images/flags/SD.png"
    },
    {
        name: "Sweden",
        flag: "/images/flags/SE.png"
    },
    {
        name: "Switzerland",
        flag: "/images/flags/SW.png"
    },
    {
        name: "Singapore",
        flag: "/images/flags/SG.png"
    },
    {
        name: "St. Helena",
        flag: "/images/flags/SH.png"
    },
    {
        name: "Slovakia",
        flag: "/images/flags/SK.png"
    },
    {
        name: "Slovenia",
        flag: "/images/flags/SI.png"
    },
    {
        name: "Sierra Leone",
        flag: "/images/flags/SL.png"
    },
    {
        name: "San Marino",
        flag: "/images/flags/SM.png"
    },
    {
        name: "Senegal",
        flag: "/images/flags/SN.png"
    },
    {
        name: "Somalia",
        flag: "/images/flags/SO.png"
    },
    {
        name: "Suriname",
        flag: "/images/flags/SR.png"
    },
    {
        name: "South Sudan",
        flag: "/images/flags/SS.png"
    },
    {
        name: "São Tomé & Príncipe",
        flag: "/images/flags/ST.png"
    },
    {
        name: "El Salvador",
        flag: "/images/flags/SV.png"
    },
    {
        name: "Sint Maarten",
        flag: "/images/flags/SX.png"
    },
    {
        name: "Syria",
        flag: "/images/flags/SY.png"
    },
    {
        name: "Eswatini",
        flag: "/images/flags/SZ.png"
    },
    {
        name: "Tristan Da Cunha",
        flag: "/images/flags/TC.png"
    },
    {
        name: "Chad",
        flag: "/images/flags/TD.png"
    },
    {
        name: "French Southern Territories",
        flag: "/images/flags/TF.png"
    },
    {
        name: "Togo",
        flag: "/images/flags/TG.png"
    },
    {
        name: "Thailand",
        flag: "/images/flags/TH.png"
    },
    {
        name: "Tajikistan",
        flag: "/images/flags/TJ.png"
    },
    {
        name: "Tokelau",
        flag: "/images/flags/TK.png"
    },
    {
        name: "Timor-Leste",
        flag: "/images/flags/TL.png"
    },
    {
        name: "Turkmenistan",
        flag: "/images/flags/TM.png"
    },
    {
        name: "Tunisia",
        flag: "/images/flags/TN.png"
    },
    {
        name: "Tonga",
        flag: "/images/flags/TO.png"
    },
    {
        name: "Turkey",
        flag: "/images/flags/TR.png"
    },
    {
        name: "Trinidad & Tobago",
        flag: "/images/flags/TT.png"
    },
    {
        name: "Tuvalu",
        flag: "/images/flags/TV.png"
    },
    {
        name: "Taiwan",
        flag: "/images/flags/TW.png"
    },
    {
        name: "Tanzania",
        flag: "/images/flags/TZ.png"
    },
    {
        name: "Ukraine",
        flag: "/images/flags/UA.png"
    },
    {
        name: "Uganda",
        flag: "/images/flags/UG.png"
    },
    {
        name: "U.S. Outlying Islands",
        flag: "/images/flags/UM.png"
    },
    {
        name: "Uruguay",
        flag: "/images/flags/UY.png"
    },
    {
        name: "Uzbekistan",
        flag: "/images/flags/UZ.png"
    },
    {
        name: "Vatican City",
        flag: "/images/flags/VA.png"
    },
    {
        name: "St. Vincent & Grenadines",
        flag: "/images/flags/VC.png"
    },
    {
        name: "Venezuela",
        flag: "/images/flags/VE.png"
    },
    {
        name: "British Virgin Islands",
        flag: "/images/flags/VG.png"
    },
    {
        name: "U.S. Virgin Islands",
        flag: "/images/flags/VI.png"
    },
    {
        name: "Vietnam",
        flag: "/images/flags/VN.png"
    },
    {
        name: "Vanuatu",
        flag: "/images/flags/VU.png"
    },
    {
        name: "Wallis & Futuna",
        flag: "/images/flags/WF.png"
    },
    {
        name: "Samoa",
        flag: "/images/flags/WS.png"
    },
    {
        name: "Yemen",
        flag: "/images/flags/YE.png"
    },
    {
        name: "Mayotte",
        flag: "/images/flags/YT.png"
    },
    {
        name: "South Africa",
        flag: "/images/flags/ZA.png"
    },
    {
        name: "Zambia",
        flag: "/images/flags/ZM.png"
    },
    {
        name: "Zimbabwe",
        flag: "/images/flags/ZW.png"
    }
];

module.exports = countries; 