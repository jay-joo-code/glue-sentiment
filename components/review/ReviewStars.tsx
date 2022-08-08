import React from "react"
import ReactStars from "react-stars"

interface IReviewStarsProps {
  value: number
  size?: number
  edit?: boolean
  onChange?: (newRating: number) => void
}

const ReviewStars = ({
  value,
  onChange,
  size = 14,
  edit = false,
}: IReviewStarsProps) => {
  return (
    <ReactStars
      count={5}
      color2={"#ffd700"}
      onChange={onChange}
      half={true}
      value={value}
      size={size}
      edit={edit}
    />
  )
}

export default ReviewStars
