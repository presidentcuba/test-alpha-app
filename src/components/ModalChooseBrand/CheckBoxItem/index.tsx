import { Checkbox } from "antd";
import { useEffect, useState } from "react";

interface IProps {
  item: any;
  onChange: (evt: any, data: any) => void;
  checkedList?: any;
}
const CheckBoxItem: React.FC<IProps> = ({ item, onChange, checkedList }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checkedList.length) {
      checkedList.forEach((key: string) => {
        if (key === item.companyName) {
          setChecked(true);
        }
      });
    }
  }, [checkedList]);
  const handleChecked = (e: any, data: any) => {
    onChange(e.target.checked, data);
    setChecked(e.target.checked);
  };
  return (
    <Checkbox checked={checked} onChange={(e) => handleChecked(e, item)}>
      {item.companyName}
    </Checkbox>
  );
};
export default CheckBoxItem;
