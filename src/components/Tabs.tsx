import * as React from 'react'
import styled from 'styled-components'

interface Tab {
  title: string,
  renderContents: () => JSX.Element
}

interface Props {
  tabs: Tab[]
}

export default function Tabs({ tabs }: Props) {
  const [selected, setSelected] = React.useState(0)

  return (
    <div>
      <TabsList>
        {tabs.map((tab, idx) =>
          <TabItem
            key={idx}
            active={selected === idx}
            onClick={() => setSelected(idx)}
          >
            {tab.title}
          </TabItem>
        )}
      </TabsList>
      <TabContents>
        {tabs[selected].renderContents()}
      </TabContents>
    </div>
  )
}

const TabsList = styled.ul`
  display: flex;
  padding: 0;
  margin-bottom: 0;
  list-style: none;
  border-bottom: solid 2px #e4e4e4;
`

const TabItem = styled.li`
  font-size: 14px;
  padding: 6px 12px;
  cursor: pointer;
  background-color: white;
  transition: all 300ms ease-in-out;
  border-bottom: solid 2px ${({ active }: { active: boolean }) => active ? '#925742' : '#e4e4e4'};
  margin-bottom: -2px;
  
  &:hover {
    background-color: #e4e4e4;
  }
`

const TabContents = styled.div`
  display: flex;
  flex-direction: column;
`