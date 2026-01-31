import { NextRequest, NextResponse } from 'next/server';
import { studies, weeks, families } from '@/lib/db/operations';
import { getNextTuesday, toISODateString } from '@/lib/utils';

// Sample data for seeding the database
const SAMPLE_FAMILIES = [
  {
    name: 'Ingersoll',
    code: 'INGERSOLL2024',
    members: ['Kurtis', 'Family'],
    isAdmin: true,
  },
  {
    name: 'Smith',
    code: 'SMITH2024',
    members: ['John', 'Jane', 'Kids'],
    isAdmin: false,
  },
  {
    name: 'Johnson',
    code: 'JOHNSON2024',
    members: ['Mike', 'Sarah'],
    isAdmin: false,
  },
  {
    name: 'Williams',
    code: 'WILLIAMS2024',
    members: ['David', 'Emily', 'Grace'],
    isAdmin: false,
  },
];

function generateWeeks(studyId: string, startDate: Date, count: number) {
  const weeksData = [];
  const currentDate = new Date(startDate);

  const readings = [
    { bible: 'Romans 1:1-17', book: 'Introduction & Chapter 1' },
    { bible: 'Romans 1:18-32', book: 'Chapter 2' },
    { bible: 'Romans 2:1-29', book: 'Chapter 3' },
    { bible: 'Romans 3:1-31', book: 'Chapter 4' },
    { bible: 'Romans 4:1-25', book: 'Chapter 5' },
    { bible: 'Romans 5:1-21', book: 'Chapter 6' },
    { bible: 'Romans 6:1-23', book: 'Chapter 7' },
    { bible: 'Romans 7:1-25', book: 'Chapter 8' },
    { bible: 'Romans 8:1-39', book: 'Chapter 9' },
    { bible: 'Romans 9:1-33', book: 'Chapter 10' },
  ];

  const questionSets = [
    [
      'What does Paul mean by "the gospel is the power of God for salvation"?',
      'How does Paul describe his calling as an apostle?',
      'What is the significance of "the righteous shall live by faith"?',
    ],
    [
      "How does Paul describe humanity's rejection of God?",
      'What are the consequences of exchanging truth for a lie?',
      'How do we see these patterns in our culture today?',
    ],
    [
      'Why does Paul say "you have no excuse" to those who judge others?',
      "What is the purpose of God's kindness according to this passage?",
      "How should understanding God's judgment affect our daily lives?",
    ],
    [
      'What does it mean that "all have sinned and fall short"?',
      'How is righteousness credited apart from works?',
      'What role does faith play in justification?',
    ],
    [
      'How was Abraham justified before God?',
      "What is the relationship between faith and works in Abraham's life?",
      "How does Abraham's faith serve as an example for us?",
    ],
    [
      'What does it mean to have "peace with God"?',
      'How do suffering and hope relate in the Christian life?',
      'What is significant about Christ dying for us "while we were still sinners"?',
    ],
    [
      'What does Paul mean by "dead to sin but alive to God"?',
      'How should we present ourselves as instruments of righteousness?',
      'What is the difference between being slaves to sin vs. slaves to righteousness?',
    ],
    [
      'What is the purpose of the law according to Paul?',
      'How does Paul describe his inner struggle with sin?',
      'How do you relate to Paul\'s cry "who will rescue me from this body of death"?',
    ],
    [
      'What does it mean to live by the Spirit?',
      'How does the Spirit help us in our weakness?',
      'What is the significance of "nothing can separate us from the love of God"?',
    ],
    [
      'How does Paul express his anguish for his fellow Israelites?',
      "What does this passage teach about God's sovereignty?",
      "How should we think about election and God's purposes?",
    ],
  ];

  for (let i = 0; i < count; i++) {
    const reading = readings[i % readings.length];
    const questions = questionSets[i % questionSets.length];

    weeksData.push({
      studyId,
      weekNumber: i + 1,
      date: toISODateString(currentDate),
      title: `Week ${i + 1}: ${reading.bible.split(':')[0]}`,
      readings: [
        {
          id: `reading-bible-${i + 1}`,
          type: 'bible' as const,
          reference: reading.bible,
          description: 'Primary Scripture reading',
        },
        {
          id: `reading-book-${i + 1}`,
          type: 'book' as const,
          reference: reading.book,
          description: 'Companion book reading',
        },
      ],
      questions: questions.map((text, qIndex) => ({
        id: `question-${i + 1}-${qIndex + 1}`,
        number: qIndex + 1,
        text,
      })),
    });

    // Move to next Tuesday
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeksData;
}

export async function POST(request: NextRequest) {
  try {
    // Check for secret key in production
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (process.env.NODE_ENV === 'production' && secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      families: [] as string[],
      study: null as string | null,
      weeks: [] as string[],
    };

    // 1. Create families
    for (const familyData of SAMPLE_FAMILIES) {
      try {
        // Check if family already exists
        const existing = await families.getByCode(familyData.code);
        if (!existing) {
          const family = await families.create(familyData);
          results.families.push(family.name);
        } else {
          results.families.push(`${existing.name} (already exists)`);
        }
      } catch (error) {
        console.error(`Error creating family ${familyData.name}:`, error);
      }
    }

    // 2. Check if active study exists
    let activeStudy = await studies.getActive();

    if (!activeStudy) {
      // Create a new study starting from the upcoming Tuesday
      const startDate = getNextTuesday();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 9 * 7); // 10 weeks

      activeStudy = await studies.create({
        title: 'Romans: The Gospel of Grace',
        description:
          'A 10-week study through the book of Romans, exploring the foundations of the gospel and what it means to live by faith.',
        startDate: toISODateString(startDate),
        endDate: toISODateString(endDate),
        isActive: true,
      });
      results.study = activeStudy.title;
    } else {
      results.study = `${activeStudy.title} (already exists)`;
    }

    // 3. Create weeks for the study
    const existingWeeks = await weeks.getByStudy(activeStudy.id);

    if (existingWeeks.length === 0) {
      const startDate = new Date(activeStudy.startDate);
      const weeksData = generateWeeks(activeStudy.id, startDate, 10);

      for (const weekData of weeksData) {
        try {
          const week = await weeks.create(weekData);
          results.weeks.push(`Week ${week.weekNumber}`);
        } catch (error) {
          console.error(`Error creating week ${weekData.weekNumber}:`, error);
        }
      }
    } else {
      results.weeks.push(`${existingWeeks.length} weeks already exist`);
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results,
      familyCodes: SAMPLE_FAMILIES.map((f) => ({ name: f.name, code: f.code, isAdmin: f.isAdmin })),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
