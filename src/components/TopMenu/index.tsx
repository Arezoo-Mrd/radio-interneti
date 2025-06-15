import { cookies } from "next/headers";

const TopMenu = async () => {
 const userInfo = (await cookies()).get("user_info")?.value;
 const userInfoJson = userInfo ? JSON.parse(userInfo) : null;

 return (
  <div className="flex w-full justify-between items-center">
   <span>پنل کاربری</span>
   {userInfoJson && userInfoJson.email && <p>{userInfoJson?.email}</p>}
  </div>
 );
};

export default TopMenu;
