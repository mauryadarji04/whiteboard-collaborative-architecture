import { Rect, Circle, Line, Text, Transformer } from 'react-konva'
import { useRef, useEffect } from 'react'

export default function ShapeRenderer({ shape, isSelected, onSelect, onUpdate, tool }) {
  const shapeRef = useRef()
  const transformerRef = useRef()

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  const handleDragEnd = (e) => {
    onUpdate({
      x: e.target.x(),
      y: e.target.y(),
    })
  }

  const handleTransformEnd = (e) => {
    const node = shapeRef.current
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    onUpdate({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  // Handle selection without triggering updates
  const handleClick = (e) => {
    e.cancelBubble = true
    onSelect()
  }

  const commonProps = {
    ref: shapeRef,
    onClick: handleClick,
    onTap: handleClick,
    draggable: tool === 'select' && isSelected,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  }

  if (shape.type === 'rect') {
    return (
      <>
        <Rect
          {...commonProps}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fill={shape.fill}
          stroke={shape.stroke || '#000'}
          strokeWidth={shape.strokeWidth || 2}
        />
        {isSelected && tool === 'select' && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox
              }
              return newBox
            }}
          />
        )}
      </>
    )
  }

  if (shape.type === 'circle') {
    return (
      <>
        <Circle
          {...commonProps}
          x={shape.x}
          y={shape.y}
          radius={shape.radius}
          fill={shape.fill}
          stroke={shape.stroke || '#000'}
          strokeWidth={shape.strokeWidth || 2}
        />
        {isSelected && tool === 'select' && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox
              }
              return newBox
            }}
          />
        )}
      </>
    )
  }

  if (shape.type === 'line') {
    return (
      <Line
        {...commonProps}
        points={shape.points}
        stroke={shape.fill}
        strokeWidth={shape.strokeWidth || 2}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
      />
    )
  }

  if (shape.type === 'text') {
    return (
      <>
        <Text
          {...commonProps}
          x={shape.x}
          y={shape.y}
          text={shape.text || 'Text'}
          fontSize={shape.fontSize || 20}
          fill={shape.fill}
        />
        {isSelected && tool === 'select' && (
          <Transformer ref={transformerRef} />
        )}
      </>
    )
  }

  return null
}