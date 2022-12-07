// import axios from 'axios'
import http from "../utils/requset";
import { Base64 } from "js-base64"; // 引入

//一个场景
//开发的时候 请求的服务器地址是 http://192.168.2.52:8081/

//测试的时候 请求的地址是 http://192.168.1.222:80/

//上线的时候 请求的地址是 http://chst.vip

console.log(process.env);
console.log(process.env.NODE_ENV);





//常规登入
// http://192.168.1.222/NjnuService/WebApi/NjnuService
let dizhi = window.domain

export let loginApi = (username, password) => {
  // 转码x
  let password1 = Base64.encode(password);
  // console.log(password1);
  let userinfo = `
        <Request>
            <ServiceCode>NJNU.WARDCAMS.LOGON</ServiceCode>
            <TransNo>0</TransNo>
            <ParamList>
                <UserName>${username}</UserName>
                <Password>${password1}</Password>
            </ParamList>
        </Request>
        `;
  return http.post(dizhi, userinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  // .then(res=>{console.log(res.data);})
};

//获取所有床位
export let getbedsApi = (areaid) => {
  // console.log(password1);
  let bedsinfo = `
        <Request>
            <ServiceCode>NJNU.WARDCAMS.NURSE</ServiceCode>
            <TransNo>4</TransNo>
            <ParamList>
                <AreaID>${areaid}</AreaID>
            </ParamList>
        </Request>
        `;
  return http.post(dizhi, bedsinfo, {
    headers: {
      // "Content-Type": "text/plain"
      "Content-Type": "text/plain",
    },
  });
};

//获得所有项目
export let getprojectsApi = (count = -1, page = 1, areaid) => {
  // console.log(password1);
  let projectsinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.Exam</ServiceCode>
        <TransNo>0</TransNo>
        <ParamList>
        <AreaId>${areaid}</AreaId>
            <RowIndex>${page}</RowIndex>
            <RowCount>${count}</RowCount>
        </ParamList>
    </Request>

        `;
  return http.post(dizhi, projectsinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

// 显示床位和项目之间的关系
export let showbedtoprojectApi = (page, count, isall, areaid) => {
  // console.log(password1);
  let showbedtoprojectinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.NURSE</ServiceCode>
        <TransNo>5</TransNo>
        <ParamList>
            <AreaId>${areaid}</AreaId>
            <RowIndex>${page}</RowIndex>
            <RowCount>${count}</RowCount>
            <IsAll>${isall}</IsAll>
        </ParamList>
    </Request>

        `;
  return http.post(dizhi, showbedtoprojectinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

// 新建病床和项目之间的关系
export let addbedtoprojectApi = (bedid, itemcode, areaid) => {
  // console.log(password1);
  let addbedtoprojectinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.NURSE</ServiceCode>
            <TransNo>6</TransNo>
        <ParamList>
        <BedId>${bedid}</BedId>
        <ItemCode>${itemcode}</ItemCode>
        <UserId>${areaid}</UserId>
        </ParamList>
    </Request>

      `;
  return http.post(dizhi, addbedtoprojectinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

// 项目维护页面 排序 
export let sortProjectsApi = ( itemcode, areaid) => {
  // console.log(password1);
  let sortprojectinfo = `
  <Request>
    <ServiceCode>NJNU.WARDCAMS.Exam</ServiceCode>
    <TransNo>4</TransNo>
    <ParamList>
        <ItemCode>${itemcode}</ItemCode>
        <AreaId>${areaid}</AreaId>
    </ParamList>
  </Request>
  `;
  return http.post(dizhi, sortprojectinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//新建项目
export let addprojectsApi = (itemid, itemname, memo, areaid) => {
  // console.log(password1);
  let addprojectsinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.Exam</ServiceCode>
        <TransNo>1</TransNo>
        <ParamList>
            <ItemCode>${itemid}</ItemCode>
            <ItemName>${itemname}</ItemName>
                <Memo>${memo}</Memo>
                <UserId>${areaid}</UserId>
        </ParamList>
    </Request>

        `;
  return http.post(dizhi, addprojectsinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//建立或移除项目区域关系
export let buildrelationsApi = (itemid, areaid, option) => {
  // console.log(password1);
  let buildrelationsinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.Exam</ServiceCode>
        <TransNo>2</TransNo>
        <ParamList>
            <ItemCode>${itemid}</ItemCode>
            <AreaId>${areaid}</AreaId>
            <Action>${option}</Action>
        </ParamList>
    </Request>


        `;
  return http.post(dizhi, buildrelationsinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//删除项目
export let rmoveprojectsApi = (itemid, areaid) => {
  // console.log(password1);
  let removeprojectsinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.Exam</ServiceCode>
        <TransNo>3</TransNo>
        <ParamList>
            <ItemCode>${itemid}</ItemCode>
            <AreaId>${areaid}</AreaId>
        </ParamList>
    </Request>


        `;
  return http.post(dizhi, removeprojectsinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//显示区域呼机

export let showAreaBPApi = (areaid, bptype) => {
  // console.log(password1);
  let showAreaBPinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.NURSE</ServiceCode>
        <TransNo>0</TransNo>
        <ParamList>
            <AreaId>${areaid}</AreaId>
            <TelType>${bptype}</TelType>
        </ParamList>
    </Request>

     `;
  return http.post(dizhi, showAreaBPinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//显示排班人员信息

export let showOndutystaffApi = (areaid) => {
  let showStaffinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.NURSE</ServiceCode>
        <TransNo>2</TransNo>
        <ParamList>
                <AreaId>${areaid}</AreaId>
        </ParamList>
    </Request>


     `;
  return http.post(dizhi, showStaffinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//获取所有职工
export let getallstaffApi = (staffclass, staffname, areaid) => {
  // console.log(password1);
  let allstaffinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.NURSE</ServiceCode>
        <TransNo>1</TransNo>
        <ParamList>
            <AreaId>${areaid}</AreaId>
            <RoleCode>${staffclass}</RoleCode>
            <Name>${staffname}</Name>
        </ParamList>
    </Request>

     `;
  return http.post(dizhi, allstaffinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//新建或更改呼机电话
// bpnumbers=[{"cate":0,"number":1,},{"cate":0,"number":1,}]
export let changeBPApi = (areaid, bpnumbers, userid) => {
  // let  = []
  let bpnumberhtml = "";
  for (let i = 0; i < bpnumbers.length; i++) {
    const element = bpnumbers[i];
    bpnumberhtml += `<PhoneItem>
        <TelType>${bpnumbers[i].cate}</TelType>
        <PhoneNum>${bpnumbers[i].number}</PhoneNum>
    </PhoneItem>`;
  }
  // console.log(password1);
  let changeBPinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.Tel</ServiceCode>
        <TransNo>1</TransNo>
        <ParamList>
            <AreaId>${areaid}</AreaId>
            <Phone>
                <![CDATA[<PhoneItems>
                        ${bpnumberhtml}
                    </PhoneItems>]]>
            </Phone>
            <UserId>${userid}</UserId>
        </ParamList>
    </Request>

     `;
  return http.post(dizhi, changeBPinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

//新建排班人员信息
// ondutystaffs=[{"cate":0,"number":1,},{"cate":0,"number":1,}]
export let changeOndutyStaffApi = (areaid, ondutystaffs, userid) => {
  // let  = []
  let ondutyhtml = "";
  for (let i = 0; i < ondutystaffs.length; i++) {
    const element = ondutystaffs[i];
    ondutyhtml += `<DutyStaff>
            <StaffType>${ondutystaffs[i].cate}</StaffType>
            <EmpNo>${ondutystaffs[i].peopleid}</EmpNo>
        </DutyStaff>
    `;
  }
  // console.log(password1);
  let changeOndutystaffinfo = `
    <Request>
        <ServiceCode>NJNU.WARDCAMS.NURSE</ServiceCode>
        <TransNo>3</TransNo>
            <ParamList>
                <AreaId>${areaid}</AreaId>
                <UserId>${userid}</UserId>
                <Staff>
                    <![CDATA[<DutyStaffs>
                            ${ondutyhtml}
                        </DutyStaffs>]]>
                </Staff>
            </ParamList>
    </Request>

     `;
  return http.post(dizhi, changeOndutystaffinfo, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
