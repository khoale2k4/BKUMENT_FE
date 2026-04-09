// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { describe, it, expect, vi, beforeEach } from "vite"; // Đổi thành jest nếu dùng Jest
// import RatingForm from "./RatingForm";

// describe("RatingForm Component", () => {
//   const mockOnSubmit = vi.fn();
//   const mockOnCancel = vi.fn();

//   // Reset lại các hàm mock trước mỗi bài test để không bị lẫn lộn dữ liệu
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("1. Hiển thị đúng giao diện ở chế độ Thêm mới (Create Mode)", () => {
//     render(
//       <RatingForm
//         isEditing={false}
//         isSubmitting={false}
//         onSubmit={mockOnSubmit}
//       />,
//     );

//     // Kiểm tra tiêu đề
//     expect(screen.getByText("Thêm đánh giá mới")).toBeInTheDocument();

//     // Nút Hủy bỏ không được xuất hiện ở chế độ Thêm mới
//     expect(screen.queryByText("Hủy bỏ")).not.toBeInTheDocument();

//     // Nút Gửi hiển thị đúng chữ
//     expect(
//       screen.getByRole("button", { name: /Gửi đánh giá/i }),
//     ).toBeInTheDocument();
//   });

//   it("2. Hiển thị đúng dữ liệu khởi tạo ở chế độ Chỉnh sửa (Edit Mode)", () => {
//     render(
//       <RatingForm
//         isEditing={true}
//         initialScore={4}
//         initialComment="Gia sư dạy rất hay"
//         isSubmitting={false}
//         onSubmit={mockOnSubmit}
//         onCancel={mockOnCancel}
//       />,
//     );

//     // Kiểm tra tiêu đề và nội dung cũ
//     expect(screen.getByText("Chỉnh sửa đánh giá của bạn")).toBeInTheDocument();
//     expect(screen.getByText("4 / 5 Sao")).toBeInTheDocument();
//     expect(screen.getByDisplayValue("Gia sư dạy rất hay")).toBeInTheDocument();

//     // Nút Hủy bỏ và Cập nhật phải xuất hiện
//     expect(screen.getByRole("button", { name: /Hủy bỏ/i })).toBeInTheDocument();
//     expect(
//       screen.getByRole("button", { name: /Cập nhật đánh giá/i }),
//     ).toBeInTheDocument();
//   });

//   it("3. Vô hiệu hóa nút Submit nếu chưa nhập bình luận (Validation)", async () => {
//     render(
//       <RatingForm
//         isEditing={false}
//         isSubmitting={false}
//         onSubmit={mockOnSubmit}
//       />,
//     );

//     const submitButton = screen.getByRole("button", { name: /Gửi đánh giá/i });

//     // Ban đầu comment rỗng -> Nút phải bị disabled
//     expect(submitButton).toBeDisabled();

//     const user = userEvent.setup();
//     const textarea = screen.getByPlaceholderText(/Bạn nghĩ sao về gia sư này/i);

//     // Gõ khoảng trắng (whitespace) -> Vẫn phải bị disabled
//     await user.type(textarea, "   ");
//     expect(submitButton).toBeDisabled();

//     // Gõ chữ thật -> Nút hết disabled
//     await user.type(textarea, "Tuyệt vời");
//     expect(submitButton).not.toBeDisabled();
//   });

//   it("4. Gọi hàm onSubmit với đúng điểm số và bình luận khi bấm Gửi", async () => {
//     const user = userEvent.setup();
//     render(
//       <RatingForm
//         isEditing={false}
//         isSubmitting={false}
//         onSubmit={mockOnSubmit}
//       />,
//     );

//     const textarea = screen.getByPlaceholderText(/Bạn nghĩ sao về gia sư này/i);
//     const submitButton = screen.getByRole("button", { name: /Gửi đánh giá/i });

//     // Nhập bình luận
//     await user.type(textarea, "Học rất dễ hiểu!");
//     await user.click(submitButton);

//     // Kiểm tra xem hàm onSubmit có được gọi 1 lần với tham số (score mặc định là 5, comment) không
//     expect(mockOnSubmit).toHaveBeenCalledTimes(1);
//     expect(mockOnSubmit).toHaveBeenCalledWith(5, "Học rất dễ hiểu!");
//   });

//   it("5. Cập nhật số sao khi người dùng bấm vào các icon Star", async () => {
//     const user = userEvent.setup();
//     // Render bằng cách lấy ra container để dễ tìm thẻ SVG của icon Star
//     const { container } = render(
//       <RatingForm
//         isEditing={false}
//         isSubmitting={false}
//         onSubmit={mockOnSubmit}
//       />,
//     );

//     // Tìm tất cả các thẻ SVG (chính là 5 ngôi sao)
//     const stars = container.querySelectorAll("svg");
//     expect(stars.length).toBe(5);

//     // Bấm vào ngôi sao thứ 3 (index 2)
//     await user.click(stars[2]);

//     // Kiểm tra text hiển thị điểm số đã cập nhật thành 3 chưa
//     expect(screen.getByText("3 / 5 Sao")).toBeInTheDocument();

//     // Gõ text và submit để check xem nó có gửi đúng số 3 đi không
//     const textarea = screen.getByPlaceholderText(/Bạn nghĩ sao về gia sư này/i);
//     await user.type(textarea, "Tạm được");
//     await user.click(screen.getByRole("button", { name: /Gửi đánh giá/i }));

//     expect(mockOnSubmit).toHaveBeenCalledWith(3, "Tạm được");
//   });

//   it("6. Vô hiệu hóa nút và đổi chữ khi isSubmitting = true", () => {
//     render(
//       <RatingForm
//         isEditing={false}
//         initialComment="Test submitting"
//         isSubmitting={true} // <-- Bật cờ submitting
//         onSubmit={mockOnSubmit}
//       />,
//     );

//     const submitButton = screen.getByRole("button");

//     expect(submitButton).toBeDisabled();
//     expect(screen.getByText("Đang xử lý...")).toBeInTheDocument();
//   });

//   it("7. Gọi hàm onCancel khi bấm nút Hủy bỏ", async () => {
//     const user = userEvent.setup();
//     render(
//       <RatingForm
//         isEditing={true}
//         initialComment="Test cancel"
//         isSubmitting={false}
//         onSubmit={mockOnSubmit}
//         onCancel={mockOnCancel} // <-- Truyền hàm mock
//       />,
//     );

//     const cancelButton = screen.getByRole("button", { name: /Hủy bỏ/i });
//     await user.click(cancelButton);

//     expect(mockOnCancel).toHaveBeenCalledTimes(1);
//   });
// });
