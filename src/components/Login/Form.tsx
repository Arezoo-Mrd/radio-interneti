import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

const Form = () => {
 return (
  <form className="w-full flex flex-col gap-4 md:pt-8 relative z-10">
   <Input placeholder="ایمیل" />
   <Input placeholder="رمز" />
   <div className="flex items-center gap-2">
    <Checkbox id="remember" />
    <label htmlFor="remember" className="text-sm text-slate-smoke">
     مرا به خاطر بسپار.
    </label>
   </div>
   <div className="w-full md:pt-4">
    <Button className="w-full">ورود</Button>
   </div>
  </form>
 );
};

export default Form;
