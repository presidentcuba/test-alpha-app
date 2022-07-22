import React, { useEffect, useRef, useState, ReactNode } from "react";
import { Button, Modal, Space, Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { data } from "./data";
import CheckBoxItem from "./CheckBoxItem";
import styles from "./styles.module.scss";

const compare = (a: any, b: any) => {
  if (a.companyName.toLowerCase() < b.companyName.toLowerCase()) {
    return -1;
  }
  if (a.companyName.toLowerCase() > b.companyName.toLowerCase()) {
    return 1;
  }
  return 0;
};
const removeVietnameseTones = (str: string) => {
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/, "#");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "#");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/, "#");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/, "#");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/, "#");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/, "#");
  str = str.replace(/Đ/, "#");
  return str;
};
interface IProps {
  dataProps?: any;
  closeIcon?: ReactNode;
  total?: number;
  titleButton?: string;
  titleModal?: string;
  cancelText?: string;
  submitText?: string;
  searchText?: string;
  brandText?: string;
  closable?: boolean;

  onChangeChecked?: (data: any) => void;
}
const ModalChooseBrand: React.FC<IProps> = ({
  dataProps,
  onChangeChecked,
  total = 99,
  titleButton = "Chọn thương hiệu",
  titleModal = "Chọn thương hiệu kinh doanh",
  cancelText = "Bỏ chọn",
  submitText = "Áp dụng",
  brandText = "thương hiệu",
  searchText = "Tìm kiếm thương hiệu",
  closable = false,
  closeIcon,
}) => {
  const totalALL = total;

  const boxElement = useRef<any>();

  const [newData, setNewData] = useState<any>([]);

  const [arrayKey, setArrayKey] = useState<any[]>([]);

  const [isCheck, setIsCheck] = useState(arrayKey[0] || "");

  const [clicked, setClicked] = useState<string>(arrayKey[0] || "");

  const [checkedList, setCheckedList] = useState<(number | string)[]>([]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [dataTemp, setDataTemp] = useState<any[]>([]);

  const allProductBlock = useRef<NodeListOf<Element> | any>();

  const timeOutSearch: { current: NodeJS.Timeout | null } = useRef(null);

  useEffect(() => {
    if (checkedList.length) {
      onChangeChecked && onChangeChecked(checkedList);
    }
  }, [checkedList]);

  useEffect(() => {
    const filterData: any[] = dataProps?.filter(
      (item: any) => item.companyName.length !== 0
    );
    const cloneData: any[] = filterData?.sort(compare);
    if (cloneData && cloneData.length) {
      setDataTemp(cloneData);
    }
  }, [dataProps]);

  useEffect(() => {
    dataTemp && handleFetchingData(dataTemp);
  }, [dataTemp]);

  useEffect(() => {
    if (clicked && boxElement.current) {
      boxElement.current.scroll({
        top: document.getElementById(clicked)?.offsetTop || 0,
        behavior: "auto",
      });
    }
  }, [clicked, boxElement.current]);

  const handleScroll = () => {
    const element = document.getElementById("scroll-container");
    const scrollY = (element && element.scrollTop) || 0;

    allProductBlock.current =
      window.document?.querySelectorAll(".box_item_scroll");
    const clone = allProductBlock.current && [...allProductBlock.current];
    let newItem: any = null;

    clone.some((item: any) => {
      const heightDiv = item.offsetTop;
      if (scrollY > 0 && heightDiv > scrollY - 20) {
        newItem = item;
      }
      return newItem;
    });
    if (newItem.id) {
      setIsCheck("");
      setClicked(newItem?.id);
    } else {
      setIsCheck("");
      setClicked(arrayKey?.[0]);
    }
  };

  const handleFetchingData = (dataTmp: any[]) => {
    const cloneNewData: any = [];
    const cloneArrayKey: any = [];

    if (dataTmp && dataTmp.length > 0) {
      dataTmp.forEach((item) => {
        const isCheck = cloneArrayKey.includes(
          item?.companyName?.toUpperCase().charAt(0)
        );

        if (isCheck) {
          cloneNewData.forEach((dataItem: any) => {
            if (dataItem.key === item.companyName?.toUpperCase().charAt(0)) {
              return {
                ...dataItem,
                data: [...dataItem.data, dataItem.data.push(item)],
              };
            }
          });
        } else {
          const objectData = {
            key: removeVietnameseTones(
              item.companyName.toUpperCase().charAt(0)
            ),
            data: [item],
          };
          cloneArrayKey.push(
            removeVietnameseTones(item.companyName.toUpperCase().charAt(0))
          );
          cloneNewData.push(objectData);
        }
      });

      setArrayKey(cloneArrayKey);
      setNewData(cloneNewData);
      setClicked(`key${cloneArrayKey[0]}`);
      setIsCheck(`key${cloneArrayKey[0]}`);
    } else {
      setArrayKey([]);
      setNewData([]);
    }
  };

  const handleChecked = (checked: boolean, value: any) => {
    if (checked) {
      setCheckedList([...checkedList, value.name]);
    } else {
      let cloneCheckedList = [...checkedList];
      const indexValue = cloneCheckedList.indexOf(value.name);

      if (indexValue !== -1) {
        cloneCheckedList.splice(indexValue, 1);
        setCheckedList(cloneCheckedList);
      }
    }
  };

  const onSearchHandle = (searchBrand: string) => {
    if (dataTemp.length) {
      const searchData = dataTemp.filter((val) => {
        if (searchBrand !== "") {
          return val.companyName
            ?.toLowerCase()
            .includes(searchBrand.toLowerCase());
        } else {
          return val;
        }
      });
      handleFetchingData(searchData);
    }
  };

  const onSearchBrand = (e: any) => {
    if (timeOutSearch.current) {
      clearTimeout(timeOutSearch.current);
    }
    timeOutSearch.current = setTimeout(() => {
      onSearchHandle(e.target.value);
    }, 500);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setCheckedList([]);
  };

  const handleUnSelect = () => {
    setCheckedList([]);
  };

  const onSubmit = () => {
    if (checkedList && checkedList.length) {
      setCheckedList([]);
      onChangeChecked && onChangeChecked(checkedList);
    }
    setIsModalVisible(false);
  };
  return (
    <div>
      <Button type="primary" onClick={showModal} className={styles.btn}>
        {titleButton}
      </Button>
      <Modal
        title={titleModal}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        closable={closable}
        className={styles.modal_container}
      >
        <div className={styles.modal_body_box}>
          <div className={styles.modal_body_box_item}>
            <div className={styles.modal_header}>
              <Space>
                <Input
                  onChange={(e) => onSearchBrand(e)}
                  placeholder={searchText}
                  suffix={<SearchOutlined />}
                />
              </Space>
              <span className={styles.total_brand}>
                Đang chọn {checkedList.length}/{totalALL} {brandText}
              </span>
            </div>
            <div className={styles.modal_body}>
              <div
                id="scroll-container"
                className={styles.modal_checkbox_container}
                ref={boxElement}
                onScroll={handleScroll}
              >
                {newData &&
                  newData.map((item: any, index: number) =>
                    item.data.length ? (
                      <div
                        id={`key${item.key}`}
                        className={`${styles.item_checkbox} box_item_scroll`}
                        key={index}
                      >
                        {item.key ? (
                          <span className={styles.item_title}>{item.key}</span>
                        ) : null}
                        <div className={styles.item_checkbox_detail}>
                          <Row>
                            {item.data.map(
                              (checkbox: any, indexCheckbox: number) => (
                                <Col span={8} key={indexCheckbox}>
                                  <CheckBoxItem
                                    item={checkbox}
                                    checkedList={checkedList}
                                    onChange={handleChecked}
                                  />
                                </Col>
                              )
                            )}
                          </Row>
                        </div>
                      </div>
                    ) : null
                  )}
              </div>

              <ul className={styles.list_key}>
                {arrayKey.map((item, index) => (
                  <li
                    className={`${
                      clicked === `key${item}` || isCheck === `key${item}`
                        ? styles.active_key
                        : ""
                    }`}
                    onClick={() => {
                      setClicked(`key${item}`);
                      setIsCheck("");
                    }}
                    key={index}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.modal_footer}>
          <div className={styles.button_box}>
            <Button type="primary" onClick={handleUnSelect}>
              {cancelText}
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              type="primary"
              ghost
              onClick={onSubmit}
            >
              {submitText}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ModalChooseBrand;
