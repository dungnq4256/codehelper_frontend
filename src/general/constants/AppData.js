const AppData = {
    jobs: [
        { value: "Computer systems manager", text: "Computer systems manager" },
        { value: "Network architect", text: "Network architect" },
        {
            value: "IT coordinatorNetwork administrator",
            text: "IT coordinatorNetwork administrator",
        },
        { value: "Network administrator", text: "Network administrator" },
        { value: "Network engineer", text: "Network engineer" },
        { value: "Service desk analyst", text: "Service desk analyst" },
        {
            value: "Wireless network engineer",
            text: "Wireless network engineer",
        },
        { value: "Database administrator", text: "Database administrator" },
        { value: "Database analyst", text: "Database analyst" },
        { value: "Data quality manager", text: "Data quality manager" },
        { value: "Database report writer", text: "Database report writer" },
        {
            value: "SQL database administrator",
            text: "SQL database administrator",
        },
        {
            value: "Big data engineer/architect",
            text: "Big data engineer/architect",
        },
        {
            value: "Business intelligence specialist/analyst",
            text: "Business intelligence specialist/analyst",
        },
        { value: "Business systems analyst", text: "Business systems analyst" },
        { value: "Data analyst", text: "Data analyst" },
        { value: "Data analytics developer", text: "Data analytics developer" },
        { value: "Data modeling analyst", text: "Data modeling analyst" },
        { value: "Data scientist", text: "Data scientist" },
        { value: "Data warehouse manager", text: "Data warehouse manager" },
        {
            value: "Data warehouse programming specialist",
            text: "Data warehouse programming specialist",
        },
        { value: "Intelligence specialist", text: "Intelligence specialist" },
        { value: "Back-end developer", text: "Back-end developer" },
        { value: "Front-end developer", text: "Front-end developer" },
        { value: "DevOps engineer", text: "DevOps engineer" },
        { value: "Full-stack developer", text: "Full-stack developer" },
        {
            value: "UI (user interface) designer",
            text: "UI (user interface) designer",
        },
    ],
    // phan trang
    perPageItems: [{ value: 5 }, { value: 10 }, { value: 20 }, { value: 30 }, { value: 50 }, { value: 100 }],

    //tag
    tagFilters: [
        { value: "", text: "T???t c???" },
        { value: 1, text: "M???i nh???t" },
        { value: -1, text: "Ti??u ?????" },
        { value: -1, text: "T??nh ph??? bi???n" },
    ],

    //gender
    genderOptions: [
        { value: "MALE", text: "Nam" },
        { value: "FEMALE", text: "N???" },
        { value: "UNKNOWN", text: "Kh??ng x??c ?????nh" },
    ],

    //question
    quetionFilter: [
        { value: "", text: "T???t c???" },
        { value: -1, text: "Nhi???u dislike nh???t" },
        { value: 1, text: "Nhi???u like nh???t" },
        { value: 0, text: "M???i nh???t" },
    ],
};

export default AppData;
