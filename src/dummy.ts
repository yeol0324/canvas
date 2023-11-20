type input = {
  type: string;
  //List 안에 position 은 각각 설정 가능하게 하기 위함
  questionList: {
    text: string;
    answer: string;
    id: string;
    position: { x: number; y: number };
  }[];
  sort: "가로" | "세로" | "";
  margin: number;
};
