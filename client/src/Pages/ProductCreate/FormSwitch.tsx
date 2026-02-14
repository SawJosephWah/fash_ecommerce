import { Switch } from "@/Components/ui/switch"
import { Label } from "@/Components/ui/label"

interface FormSwitchProps {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const FormSwitch = ({ title, description, value, onChange }: FormSwitchProps) => {
  return (
    <div className="flex items-center justify-between space-x-4 rounded-none border border-zinc-200 p-4 transition-colors hover:bg-zinc-50/50">
      <div className="flex flex-col gap-1">
        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
          {title}
        </Label>
        <p className="text-[10px] text-zinc-400 uppercase tracking-wider leading-relaxed">
          {description}
        </p>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-zinc-200"
      />
    </div>
  );
};

export default FormSwitch;