'use client';

import { Inter } from 'next/font/google';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataSet, Timeline, TimelineOptions } from 'vis';
import { FiFolderPlus, FiRefreshCw, FiUserPlus } from 'react-icons/fi';
import 'vis/dist/vis-timeline-graph2d.min.css';
import Image from 'next/image';
import Button from './components/ui/Button';
import Section from './components/ui/Section';
import H3 from './components/ui/Headings/H3';

const defaultTeachers = [
  {
    id: 1,
    name: 'Juan',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    name: 'Lula',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    name: 'Paulo',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 4,
    name: 'Carlos',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
];

const defaultLessons = [
  {
    id: 1,
    name: 'Matemáticas',
    color: '#f56565',
    teacherId: 1,
    start: new Date(2023, 2, 17, 10),
    end: new Date(2023, 2, 17, 12),
  },
  {
    id: 2,
    name: 'Lengua',
    color: '#ed8936',
    teacherId: 2,
    start: new Date(2023, 2, 17, 13),
    end: new Date(2023, 2, 17, 15),
  },
  {
    id: 3,
    name: 'Historia',
    color: '#48bb78',
    teacherId: 3,
    start: new Date(2023, 2, 17, 16),
    end: new Date(2023, 2, 17, 18),
  },
];

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const visMainDiv = useRef<HTMLDivElement>(null);
  const [teachers, setTeachers] = useState(defaultTeachers);
  const [lessons, setLessons] = useState(defaultLessons);

  const today = useMemo(() => new Date(), []);
  const { groups, items } = useMemo(() => {
    return {
      groups: new DataSet(
        teachers?.map((t) => ({
          id: t.id,
          content: t,
        }))
      ),
      items: new DataSet(
        lessons?.map(({ id, start, end, name, teacherId }) => ({
          id,
          group: teacherId,
          content: name,
          start,
          end,
        }))
      ),
    };
  }, [teachers, lessons]);
  const options = useMemo<TimelineOptions>(() => {
    return {
      width: '100%',
      height: '400px',
      editable: {
        add: false,
        remove: true,
        updateTime: true,
        overrideItems: false,
      },
      orientation: 'top',
      margin: {
        item: 10,
        axis: 15,
      },
      zoomMin: 1000 * 60 * 60,
      zoomMax: 1000 * 60 * 60 * 24 * 7,
      groupTemplate: ({ content }) => {
        return `
          <div class="flex items-center">
            <Image
              class="w-8 h-8 rounded-full mr-2"
              src="${content.avatar}"
              alt="${content.name}"
            />
            <span>${content.name}</span>
          </div>
        `;
      },
      hiddenDates: [
        {
          start: new Date(2023, 2, 17, 0),
          end: new Date(2023, 2, 17, 8),
          repeat: 'daily',
        },
        {
          start: new Date(2023, 2, 17, 19),
          end: new Date(2023, 2, 17, 23, 59, 59),
          repeat: 'daily',
        },
      ],
      onUpdate: function (item, callback) {
        const confirm = prompt(
          'Edit items text:',
          JSON.stringify(item, null, 2)
        );
        if (confirm) {
          callback(item); // send back adjusted item
        } else {
          callback(null); // cancel updating the item
        }
      },
    };
  }, []);

  const draw = useCallback(() => {
    const container = visMainDiv.current;
    if (!container) return;
    container.innerHTML = '';
    const timeline = new Timeline(visMainDiv.current, items, groups, options);
    timeline.setWindow(today, 0);
  }, [groups, items, options, today]);

  const addTeacher = useCallback(() => {
    const lastTeacherIdPlusOne = teachers[teachers.length - 1]?.id + 1;
    const newTeacher = {
      id: lastTeacherIdPlusOne,
      name: `New Teacher ${lastTeacherIdPlusOne}`,
      avatar: `https://randomuser.me/api/portraits/men/${lastTeacherIdPlusOne}.jpg`,
    };
    setTeachers((prev) => [...prev, newTeacher]);
  }, [teachers]);

  const addLesson = useCallback(() => {
    const lastLessonIdPlusOne = lessons[lessons.length - 1]?.id + 1;
    const randomHourBetween9and14 = Math.floor(Math.random() * 6) + 9;
    const randomHourBetween15and18 = Math.floor(Math.random() * 4) + 15;

    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const teacherWithRangeAvailable = teachers.find((t) => {
      const lessonsOfTeacher = lessons.filter((l) => l.teacherId === t.id);
      const lessonsOfTeacherWithRangeAvailable = lessonsOfTeacher.filter(
        (l) =>
          (l.start.getHours() <= randomHourBetween9and14 &&
            l.end.getHours() >= randomHourBetween15and18) ||
          (l.start.getHours() <= randomHourBetween9and14 &&
            l.end.getHours() >= randomHourBetween15and18)
      );
      return lessonsOfTeacherWithRangeAvailable.length === 0;
    });

    if (!teacherWithRangeAvailable) return;

    const newLesson = {
      id: lastLessonIdPlusOne,
      name: `New Lesson ${lastLessonIdPlusOne}`,
      teacherId: teacherWithRangeAvailable?.id,
      color: randomColor,
      start: new Date(2023, 2, 17, randomHourBetween9and14),
      end: new Date(2023, 2, 17, randomHourBetween15and18),
    };
    setLessons((prev) => [...prev, newLesson]);
  }, [lessons, teachers]);

  const handleMenuClick = useCallback(
    (name: string) => {
      switch (name) {
        case 'Redraw':
          draw();
          break;
        case 'Add Teacher':
          addTeacher();
          break;
        case 'Add Lesson':
          addLesson();
          break;
        default:
          break;
      }
    },
    [addLesson, addTeacher, draw]
  );

  const menuItems = useMemo(
    () => [
      {
        name: 'Redraw',
        iconLeft: FiRefreshCw,
        onClick: () => handleMenuClick('Redraw'),
      },
      {
        name: 'Add Teacher',
        iconLeft: FiUserPlus,
        onClick: () => handleMenuClick('Add Teacher'),
      },
      {
        name: 'Add Lesson',
        iconLeft: FiFolderPlus,
        onClick: () => handleMenuClick('Add Lesson'),
      },
    ],
    [handleMenuClick]
  );

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <main
      className={`${inter?.className} container mx-auto text-center pt-24 max-w-4xl`}
    >
      <h1 className="text-4xl font-bold">Next.js Gantt - VIVRA Example</h1>
      <div className="flex space-x-4 my-4 justify-center">
        {menuItems.map((item) => (
          <Button key={item.name} {...item}>
            {item.name}
          </Button>
        ))}
      </div>
      <div className="flex flex-col space-y-4">
        <Section>
          <H3>With vis.js Chart</H3>
          <div ref={visMainDiv}></div>
        </Section>
      </div>
    </main>
  );
}
