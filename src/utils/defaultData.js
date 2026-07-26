const defaultData = {
  groomName: "Đức Huy",
  brideName: "Thu Thảo",
  weddingDate: "2026-11-14T08:00:00",
  location: "Khách sạn The Reverie",
  address: "Số 1 đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh",
  coverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80",
  video: "",
  couple: {
    groom: {
      name: "Nguyễn Đức Huy",
      role: "Chú rể",
      description: "Một người yêu thiên nhiên, thích nấu ăn và luôn tin rằng tình yêu đẹp nhất là được sống cùng nhau mỗi ngày."
    },
    bride: {
      name: "Trần Thu Thảo",
      role: "Cô dâu",
      description: "Một người lãng mạn, yêu màu hồng, thích đi du lịch và luôn mong muốn một mái ấm trọn vẹn cùng người mình thương."
    }
  },
  story: [
    {
      id: 1,
      title: "Lần đầu gặp nhau",
      date: "2022-02-14",
      description: "Tình yêu bắt đầu từ một buổi chiều mưa, giữa tiếng cười và một cuộc trò chuyện rất tự nhiên.",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 2,
      title: "Ngày cầu hôn",
      date: "2024-09-12",
      description: "Một khoảnh khắc ngọt ngào dưới ánh đèn vàng, khi tất cả những điều tưởng chừng chỉ là mơ đã trở thành hiện thực.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 3,
      title: "Bắt đầu hành trình mới",
      date: "2026-11-14",
      description: "Chúng mình chuẩn bị bước vào một chương mới, nơi có nhau, có gia đình và có những điều tuyệt vời hơn nữa.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
    }
  ],
  gallery: [
    { id: 1, title: "Ngày đầu yêu nhau", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80" },
    { id: 2, title: "Kỷ niệm mùa đông", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80" },
    { id: 3, title: "Buổi hẹn hò đầu tiên", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80" },
    { id: 4, title: "Ngày cầu hôn", image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=900&q=80" },
    { id: 5, title: "Bầu trời hạnh phúc", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80" },
    { id: 6, title: "Ngày vui sắp tới", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80" }
  ],
  events: [
    {
      id: 1,
      type: "Tiệc cưới",
      title: "Lễ cưới chính thức",
      time: "08:00",
      date: "14/11/2026",
      place: "Khách sạn The Reverie",
      description: "Một buổi lễ ấm áp, đầy hoa và ánh sáng, dành cho những người thân yêu nhất."
    },
    {
      id: 2,
      type: "Tiệc tối",
      title: "Tiệc chiêu đãi",
      time: "19:00",
      date: "14/11/2026",
      place: "Sảnh tầng 2",
      description: "Đêm tiệc sẽ có âm nhạc, ăn uống và nhiều hoạt động vui vẻ cùng nhau."
    },
    {
      id: 3,
      type: "Đón khách",
      title: "Đón khách đầu tiên",
      time: "07:30",
      date: "14/11/2026",
      place: "Cổng chính",
      description: "Khu vực đón khách sẽ có đội ngũ hỗ trợ và hướng dẫn chỗ ngồi."
    }
  ],
  gifts: [
    {
      id: 1,
      title: "Lời chúc yêu thương",
      description: "Sự hiện diện của quý khách là món quà lớn nhất đối với chúng mình.",
      icon: "mdi-heart"
    },
    {
      id: 2,
      title: "Phiếu quà trị giá",
      description: "Nếu bạn muốn gửi quà, chúng mình sẽ rất hạnh phúc khi nhận được sự yêu thương ấy.",
      icon: "mdi-gift"
    }
  ],
  banks: [
    {
      id: 1,
      bankName: "Vietcombank",
      accountName: "Nguyễn Đức Huy",
      number: "1023456789",
      qr: ""
    },
    {
      id: 2,
      bankName: "Techcombank",
      accountName: "Trần Thu Thảo",
      number: "2056789123",
      qr: ""
    }
  ],
  guestbook: [
    { id: 1, name: "Minh Anh", message: "Chúc hai bạn hạnh phúc và luôn bên nhau thật lâu nhé!" },
    { id: 2, name: "Quang", message: "Một lễ cưới thật đẹp, thật ấm áp và trọn vẹn." }
  ]
};

export default defaultData;
