import React from "react"
import ReactStars from "react-rating-stars-component"

interface IReviewStarsProps {
  value: number
  size?: number
  edit?: boolean
  onChange?: (newRating: number) => void
  allowHalf?: boolean
}

const ReviewStars = ({
  value,
  onChange,
  size = 14,
  edit = false,
  allowHalf = false,
}: IReviewStarsProps) => {
  return (
    <ReactStars
      value={value}
      count={5}
      onChange={onChange}
      size={size}
      edit={edit}
      isHalf={allowHalf}
    />
  )
}

export default ReviewStars
