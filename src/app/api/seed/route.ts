import { NextRequest, NextResponse } from 'next/server';
import { studies, weeks, families, rsvps, meals } from '@/lib/db/operations';
import { toISODateString } from '@/lib/utils';

// Sample data for seeding the database
const SAMPLE_FAMILIES = [
  {
    name: 'Ingersoll',
    code: 'INGERSOLL2024',
    members: ['Kurtis', 'Sarah'],
    isAdmin: true,
  },
  {
    name: 'Smith',
    code: 'SMITH2024',
    members: ['John', 'Jane', 'Emma', 'Liam'],
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
    members: ['David', 'Emily', 'Grace', 'Noah'],
    isAdmin: false,
  },
  {
    name: 'Garcia',
    code: 'GARCIA2024',
    members: ['Carlos', 'Maria', 'Sofia'],
    isAdmin: false,
  },
];

// Rich Romans study content
const ROMANS_WEEKS = [
  {
    title: 'The Gospel Revealed',
    bible: 'Romans 1:1-17',
    bookReference: "Stott's Romans, Introduction & Ch. 1",
    questions: [
      'Paul calls himself a "servant of Christ Jesus" and an apostle. What does this dual identity tell us about Christian leadership and calling?',
      'In verse 16, Paul says he is "not ashamed of the gospel." What situations in your life tempt you to feel ashamed of your faith?',
      'What does it mean that "the righteous shall live by faith"? How does this challenge our natural tendency toward self-reliance?',
      "How does Paul describe the gospel's power? Have you experienced this power in your own life?",
    ],
  },
  {
    title: 'The Wrath of God',
    bible: 'Romans 1:18-32',
    bookReference: "Stott's Romans, Ch. 2",
    questions: [
      'Paul describes a downward spiral of sin that begins with suppressing truth. What truths does our culture actively suppress today?',
      'Verse 21 says humanity "neither glorified him as God nor gave thanks." How are gratitude and worship connected?',
      "What does Paul mean when he says God 'gave them over'? Is this passive judgment or active punishment?",
      'How should Christians engage with a culture that celebrates what God condemns, while still showing love?',
    ],
  },
  {
    title: 'The Righteous Judge',
    bible: 'Romans 2:1-16',
    bookReference: "Stott's Romans, Ch. 3",
    questions: [
      'Why does Paul say the person who judges others has "no excuse"? How does judging others reveal our own guilt?',
      "God's kindness is meant to lead us to repentance (v.4). How have you experienced God's kindness leading you to change?",
      'What is the difference between a judgmental spirit and righteous discernment?',
      'How does knowing God will judge "the secrets of men" (v.16) affect how you live your private life?',
    ],
  },
  {
    title: 'Jews, Gentiles, and the Law',
    bible: 'Romans 2:17 - 3:8',
    bookReference: "Stott's Romans, Ch. 4",
    questions: [
      'Paul challenges those who rely on the law but break it. In what ways do modern Christians fall into similar hypocrisy?',
      'What does true circumcision "of the heart" look like in practice?',
      'Paul asks "What advantage has the Jew?" and answers "Much in every way." How do spiritual privileges come with responsibility?',
      'How do you respond when your sin seems to highlight God\'s grace? Does this make sin "okay"?',
    ],
  },
  {
    title: 'None Righteous',
    bible: 'Romans 3:9-31',
    bookReference: "Stott's Romans, Ch. 5",
    questions: [
      '"All have sinned and fall short of the glory of God" (v.23). Why is it important to understand our universal sinfulness before understanding grace?',
      'Explain the term "propitiation" (v.25). How does Christ\'s sacrifice satisfy God\'s wrath?',
      'If we are justified freely by grace, is there any room for boasting? How does this challenge our pride?',
      'How does "the law of faith" (v.27) differ from "the law of works"? What does faith-based living look like day to day?',
    ],
  },
  {
    title: "Abraham's Faith",
    bible: 'Romans 4:1-25',
    bookReference: "Stott's Romans, Ch. 6",
    questions: [
      'Abraham was credited with righteousness before he was circumcised (v.10). What does this teach us about the relationship between faith and religious ritual?',
      "Paul says Abraham is the father of all who believe. How does Abraham's story encourage you in your own faith journey?",
      "Abraham believed God's promise against all hope (v.18). What impossible situations in your life require this kind of faith?",
      'How was Abraham\'s faith "strengthened" (v.20)? What strengthens your faith?',
    ],
  },
  {
    title: 'Peace with God',
    bible: 'Romans 5:1-11',
    bookReference: "Stott's Romans, Ch. 7",
    questions: [
      'We have "peace with God through our Lord Jesus Christ" (v.1). What is the difference between peace WITH God and the peace OF God?',
      'Paul says we "rejoice in our sufferings" (v.3). How can suffering produce hope rather than despair?',
      'Christ died for us "while we were still sinners" (v.8). How does this truth shape how you view yourself and others?',
      'What does it mean to be "reconciled" to God? How does reconciliation differ from just being forgiven?',
    ],
  },
  {
    title: 'Adam and Christ',
    bible: 'Romans 5:12-21',
    bookReference: "Stott's Romans, Ch. 8",
    questions: [
      'Paul draws a parallel between Adam and Christ. In what ways is Christ the "greater Adam"?',
      '"Where sin increased, grace increased all the more" (v.20). How do we hold this truth without using it as an excuse to sin?',
      'How does understanding our solidarity with Adam in sin help us understand our solidarity with Christ in righteousness?',
      'What does it mean that grace "reigns through righteousness" (v.21)? How should this affect our daily choices?',
    ],
  },
  {
    title: 'Dead to Sin, Alive in Christ',
    bible: 'Romans 6:1-23',
    bookReference: "Stott's Romans, Ch. 9",
    questions: [
      '"Shall we go on sinning so that grace may increase?" (v.1). Why is this question important to address, and what is Paul\'s answer?',
      'Baptism represents our death and resurrection with Christ (v.4). How should we live differently knowing our old self was crucified?',
      'Paul says to "count yourselves dead to sin" (v.11). This is a command, not an automatic feeling. How do we actively count ourselves dead to sin?',
      'We are "slaves to righteousness" (v.18). Does this language of slavery offend you or liberate you? Why?',
    ],
  },
  {
    title: 'The Law and Sin',
    bible: 'Romans 7:1-25',
    bookReference: "Stott's Romans, Ch. 10",
    questions: [
      'Paul uses the analogy of marriage to explain our relationship to the law (v.1-6). What does it mean to be "released from the law"?',
      '"The very thing I hate I do" (v.15). How do you relate to Paul\'s description of the struggle with sin?',
      'Is Paul describing his pre-Christian or Christian experience in verses 14-25? Why does this matter?',
      '"Who will rescue me from this body of death?" (v.24). How does Paul\'s answer in v.25 give you hope?',
    ],
  },
];

// Galatians study content (as a past/completed study example)
const GALATIANS_WEEKS = [
  {
    title: 'No Other Gospel',
    bible: 'Galatians 1:1-24',
    bookReference: "Timothy Keller's Galatians, Ch. 1-2",
    questions: [
      'Paul is astonished that the Galatians are turning to "a different gospel." What false gospels tempt Christians today?',
      'Paul received his gospel by revelation, not from human teaching. How do we balance personal revelation with the teaching of the church?',
      "What does Paul's transformation from persecutor to preacher teach us about God's grace?",
    ],
  },
  {
    title: 'Justified by Faith',
    bible: 'Galatians 2:1-21',
    bookReference: "Timothy Keller's Galatians, Ch. 3-4",
    questions: [
      'Paul opposed Peter "to his face" (v.11). When is confrontation appropriate among believers?',
      '"I have been crucified with Christ" (v.20). What does it mean to be crucified with Christ in practical terms?',
      'How does legalism undermine the grace of God (v.21)?',
    ],
  },
  {
    title: 'The Curse and the Promise',
    bible: 'Galatians 3:1-29',
    bookReference: "Timothy Keller's Galatians, Ch. 5-6",
    questions: [
      'Paul asks "Did you receive the Spirit by works of the law or by hearing with faith?" (v.2). How does this question apply to your spiritual life?',
      'Christ became "a curse for us" (v.13). How does substitutionary atonement shape your understanding of the cross?',
      'In Christ there is neither Jew nor Greek, slave nor free, male nor female (v.28). How should this unity affect church community?',
    ],
  },
  {
    title: 'Sons and Heirs',
    bible: 'Galatians 4:1-31',
    bookReference: "Timothy Keller's Galatians, Ch. 7-8",
    questions: [
      'We are adopted as sons and can call God "Abba, Father" (v.6). How does your identity as God\'s child affect your daily life?',
      'Paul fears he may have labored over them "in vain" (v.11). What causes people to fall back into legalism after experiencing grace?',
      'The allegory of Hagar and Sarah (v.21-31) contrasts slavery and freedom. Are you living as a slave or as free?',
    ],
  },
  {
    title: 'Freedom in Christ',
    bible: 'Galatians 5:1-26',
    bookReference: "Timothy Keller's Galatians, Ch. 9-10",
    questions: [
      '"For freedom Christ has set us free" (v.1). What does Christian freedom look like, and what is it not?',
      'The fruit of the Spirit vs. the works of the flesh (v.19-23). Which fruit do you need to cultivate most?',
      'How do we "walk by the Spirit" (v.16) in practical, everyday terms?',
    ],
  },
  {
    title: 'Bearing Burdens',
    bible: 'Galatians 6:1-18',
    bookReference: "Timothy Keller's Galatians, Ch. 11-12",
    questions: [
      '"Bear one another\'s burdens" (v.2) vs. "each will bear his own load" (v.5). How do we reconcile these statements?',
      '"A person reaps what he sows" (v.7). How does this principle of sowing and reaping encourage or challenge you?',
      'Paul ends by saying he bears the marks of Jesus (v.17). What "marks" of following Jesus do you bear?',
    ],
  },
];

// C.S. Lewis "Mere Christianity" study (as a book-based alternative study)
const MERE_CHRISTIANITY_WEEKS = [
  {
    title: 'Right and Wrong as a Clue to the Meaning of the Universe',
    bible: 'Romans 2:14-15',
    bookReference: 'Mere Christianity, Book I: Chapters 1-5',
    questions: [
      'Lewis argues there is a universal Moral Law that everyone knows. Do you agree? What evidence supports or challenges this?',
      'What is the difference between the "Law of Human Nature" and laws of nature like gravity?',
      'Lewis says we know the Moral Law but break it constantly. How does this connect to the Christian doctrine of sin?',
      'If there were no God, where would the Moral Law come from? How do atheists explain universal moral intuitions?',
    ],
  },
  {
    title: 'What Christians Believe',
    bible: 'John 1:1-14',
    bookReference: 'Mere Christianity, Book II: Chapters 1-5',
    questions: [
      'Lewis presents the "Liar, Lunatic, or Lord" argument about Jesus. Do you find this compelling? Why or why not?',
      'What does Lewis mean by "good infection" when describing how Christ\'s life spreads to us?',
      'How does Lewis explain the Atonement? Does his explanation help you understand the cross better?',
      'Lewis says Christianity is a "fighting religion." What does he mean, and how does this challenge passive faith?',
    ],
  },
  {
    title: 'Christian Behavior: The Cardinal Virtues',
    bible: 'Colossians 3:12-17',
    bookReference: 'Mere Christianity, Book III: Chapters 1-4',
    questions: [
      'Lewis describes the four Cardinal Virtues: Prudence, Temperance, Justice, and Fortitude. Which do you struggle with most?',
      'What is the difference between "doing good" and "being good"? Why does the distinction matter?',
      'Lewis says morality is not about rules but about "the total transformation of the soul." How does this change your view of ethics?',
      'How does Lewis address the relationship between morality and happiness? Does being good make us happy?',
    ],
  },
  {
    title: 'Christian Behavior: Social & Sexual Morality',
    bible: '1 Corinthians 6:12-20',
    bookReference: 'Mere Christianity, Book III: Chapters 5-6',
    questions: [
      "Lewis wrote about sexual morality in the 1940s. How do his insights apply to today's culture?",
      'What does Lewis mean when he says the center of Christian morality is not sexual ethics but pride?',
      'How does Lewis distinguish between the old Christian virtue of "Chastity" and social rules about modesty?',
      'Lewis speaks of sexuality as "an instinct gone wrong." Do you agree with his diagnosis? Why or why not?',
    ],
  },
  {
    title: 'Christian Behavior: Forgiveness & The Great Sin',
    bible: 'Matthew 18:21-35',
    bookReference: 'Mere Christianity, Book III: Chapters 7-8',
    questions: [
      'Lewis calls Pride "the essential vice, the utmost evil." Why does he place pride above other sins?',
      'How do we distinguish between legitimate self-respect and sinful pride?',
      "Lewis says we must forgive our enemies. How can we forgive when we've been deeply hurt?",
      'What is the relationship between loving our enemies and liking them? Must we like everyone?',
    ],
  },
  {
    title: 'Christian Behavior: Charity, Hope & Faith',
    bible: '1 Corinthians 13:1-13',
    bookReference: 'Mere Christianity, Book III: Chapters 9-12',
    questions: [
      'Lewis describes Charity as willing the good of another. How is this different from mere niceness?',
      'What role does Hope play in the Christian life? Is focusing on heaven escapism?',
      'Lewis says faith involves both belief and trust. What is the difference between these two aspects?',
      'How do you respond to Lewis\'s claim that "good works" done for salvation are worthless, but faith must produce works?',
    ],
  },
  {
    title: 'Beyond Personality: Making and Begetting',
    bible: 'John 3:1-8',
    bookReference: 'Mere Christianity, Book IV: Chapters 1-3',
    questions: [
      'Lewis distinguishes between "making" and "begetting." Why is Jesus "begotten, not made"?',
      'What does Lewis mean when he says God is beyond personality, not less than personal?',
      'How does Lewis explain the Trinity? Does his analogy of the cube help or confuse you?',
      'Lewis describes the Christian life as "Good Infection." How do we catch this divine life?',
    ],
  },
  {
    title: 'Beyond Personality: The Obstinate Toy Soldiers',
    bible: 'Romans 8:1-17',
    bookReference: 'Mere Christianity, Book IV: Chapters 4-6',
    questions: [
      'Lewis uses the image of toy soldiers coming to life. What does this teach about becoming "sons of God"?',
      'Why does Lewis say we must "pretend" to be Christ before we can become like Him?',
      'What does Lewis mean by "dressing up as Christ"? How is this different from hypocrisy?',
      'Lewis speaks of the difficulty of letting God change us. What parts of yourself resist transformation?',
    ],
  },
  {
    title: 'Beyond Personality: Is Christianity Hard or Easy?',
    bible: 'Matthew 11:28-30',
    bookReference: 'Mere Christianity, Book IV: Chapters 7-9',
    questions: [
      'Lewis says Christianity is both "almost impossibly hard and almost impossibly easy." Explain this paradox.',
      'What does Lewis mean by "The almost impossible thing is to hand over your whole self to Christ"?',
      'Lewis describes how pursuing a moderate religion is actually harder than full surrender. Do you agree?',
      'How does Lewis address the question of what happens to people who never heard of Christ?',
    ],
  },
  {
    title: 'Beyond Personality: New Men',
    bible: '2 Corinthians 5:14-21',
    bookReference: 'Mere Christianity, Book IV: Chapters 10-11',
    questions: [
      'Lewis describes the "New Men" who are emerging. What characterizes these transformed people?',
      'Why does Lewis say that we cannot see the New Man while looking in a mirror?',
      'Lewis ends by saying Christianity is about becoming "little Christs." What does this mean practically?',
      'Looking back on the whole book, what is the one idea from "Mere Christianity" that has impacted you most?',
    ],
  },
];

function generateWeeksData(studyId: string, startDate: Date, weeksContent: typeof ROMANS_WEEKS) {
  const weeksData = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < weeksContent.length; i++) {
    const content = weeksContent[i];

    weeksData.push({
      studyId,
      weekNumber: i + 1,
      date: toISODateString(currentDate),
      title: content.title,
      readings: [
        {
          id: `reading-bible-${studyId}-${i + 1}`,
          type: 'bible' as const,
          reference: content.bible,
          description: 'Primary Scripture reading for this week',
        },
        {
          id: `reading-book-${studyId}-${i + 1}`,
          type: 'book' as const,
          reference: content.bookReference,
          description: 'Companion study guide',
        },
      ],
      questions: content.questions.map((text, qIndex) => ({
        id: `question-${studyId}-${i + 1}-${qIndex + 1}`,
        number: qIndex + 1,
        text,
      })),
    });

    // Move to next Tuesday
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeksData;
}

// Get the Tuesday of the current week (or this Tuesday if today is Tuesday)
function getCurrentTuesday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
  const daysFromTuesday = daysUntilTuesday === 0 ? 0 : daysUntilTuesday - 7;

  const tuesday = new Date(today);
  tuesday.setDate(today.getDate() + (daysFromTuesday <= 0 ? daysFromTuesday : daysFromTuesday - 7));
  tuesday.setHours(0, 0, 0, 0);

  // If we're past Tuesday this week, use this week's Tuesday
  // If we're before Tuesday, use this week's upcoming Tuesday
  const currentTuesday = new Date(today);
  const diff = 2 - dayOfWeek;
  currentTuesday.setDate(today.getDate() + diff);
  currentTuesday.setHours(0, 0, 0, 0);

  return currentTuesday;
}

// Get a past Tuesday (weeks ago)
function getPastTuesday(weeksAgo: number): Date {
  const tuesday = getCurrentTuesday();
  tuesday.setDate(tuesday.getDate() - weeksAgo * 7);
  return tuesday;
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
      studies: [] as string[],
      weeks: [] as string[],
      rsvps: [] as string[],
      meals: [] as string[],
    };

    // 1. Create families
    const createdFamilies: { id: string; name: string }[] = [];
    for (const familyData of SAMPLE_FAMILIES) {
      try {
        let family = await families.getByCode(familyData.code);
        if (!family) {
          family = await families.create(familyData);
          results.families.push(family.name);
        } else {
          results.families.push(`${family.name} (exists)`);
        }
        createdFamilies.push({ id: family.id, name: family.name });
      } catch (error) {
        console.error(`Error creating family ${familyData.name}:`, error);
      }
    }

    // 2. Create Romans study (current active study)
    // Start 4 weeks ago so we have past weeks to look at, and current week is week 5
    let activeStudy = await studies.getActive();
    const romansWeekIds: string[] = [];

    if (!activeStudy) {
      const startDate = getPastTuesday(4); // 4 weeks ago
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (ROMANS_WEEKS.length - 1) * 7);

      activeStudy = await studies.create({
        title: 'Romans: The Gospel of Grace',
        description:
          "A deep dive into Paul's letter to the Romans, exploring the foundations of the gospel, justification by faith, and what it means to live a transformed life in Christ.",
        startDate: toISODateString(startDate),
        endDate: toISODateString(endDate),
        isActive: true,
      });
      results.studies.push(activeStudy.title);

      // Create weeks
      const weeksData = generateWeeksData(activeStudy.id, startDate, ROMANS_WEEKS);
      for (const weekData of weeksData) {
        try {
          const week = await weeks.create(weekData);
          romansWeekIds.push(week.id);
          results.weeks.push(`Romans Week ${week.weekNumber}: ${week.title}`);
        } catch (error) {
          console.error(`Error creating week ${weekData.weekNumber}:`, error);
        }
      }
    } else {
      results.studies.push(`${activeStudy.title} (exists)`);
      const existingWeeks = await weeks.getByStudy(activeStudy.id);
      existingWeeks.forEach((w) => romansWeekIds.push(w.id));
    }

    // 3. Create Galatians study (completed past study)
    const allStudies = await studies.getAll();
    const galatianExists = allStudies.some((s) => s.title.includes('Galatians'));

    if (!galatianExists) {
      const galatianStart = getPastTuesday(4 + ROMANS_WEEKS.length + 2); // Before Romans with a 2-week break
      const galatianEnd = new Date(galatianStart);
      galatianEnd.setDate(galatianEnd.getDate() + (GALATIANS_WEEKS.length - 1) * 7);

      const galatianStudy = await studies.create({
        title: 'Galatians: Living in Freedom',
        description:
          "A 6-week study through Paul's passionate letter to the Galatians, exploring Christian freedom, the danger of legalism, and life by the Spirit.",
        startDate: toISODateString(galatianStart),
        endDate: toISODateString(galatianEnd),
        isActive: false, // Past study
      });
      results.studies.push(`${galatianStudy.title} (past)`);

      // Create weeks for Galatians
      const galatianWeeksData = generateWeeksData(galatianStudy.id, galatianStart, GALATIANS_WEEKS);
      for (const weekData of galatianWeeksData) {
        try {
          const week = await weeks.create(weekData);
          results.weeks.push(`Galatians Week ${week.weekNumber}: ${week.title}`);
        } catch (error) {
          console.error(`Error creating Galatians week ${weekData.weekNumber}:`, error);
        }
      }
    }

    // 4. Create Mere Christianity study (another past completed book study)
    const mereChristianityExists = allStudies.some((s) => s.title.includes('Mere Christianity'));

    if (!mereChristianityExists) {
      // Place it before Galatians (even further in the past)
      const mcStart = getPastTuesday(4 + ROMANS_WEEKS.length + 2 + GALATIANS_WEEKS.length + 2);
      const mcEnd = new Date(mcStart);
      mcEnd.setDate(mcEnd.getDate() + (MERE_CHRISTIANITY_WEEKS.length - 1) * 7);

      const mcStudy = await studies.create({
        title: "Mere Christianity: C.S. Lewis's Case for the Faith",
        description:
          "A 10-week journey through C.S. Lewis's classic apologetic work, exploring the rational foundations of Christianity, moral law, and what it means to become 'New Men' in Christ.",
        startDate: toISODateString(mcStart),
        endDate: toISODateString(mcEnd),
        isActive: false, // Past study
      });
      results.studies.push(`${mcStudy.title} (past)`);

      // Create weeks for Mere Christianity
      const mcWeeksData = generateWeeksData(mcStudy.id, mcStart, MERE_CHRISTIANITY_WEEKS);
      for (const weekData of mcWeeksData) {
        try {
          const week = await weeks.create(weekData);
          results.weeks.push(`Mere Christianity Week ${week.weekNumber}: ${week.title}`);
        } catch (error) {
          console.error(`Error creating Mere Christianity week ${weekData.weekNumber}:`, error);
        }
      }
    }

    // 5. Create sample RSVPs for recent/upcoming weeks
    if (romansWeekIds.length >= 5 && createdFamilies.length >= 4) {
      const rsvpData = [
        // Week 4 (last week) - full attendance
        { weekIndex: 3, familyIndex: 0, adults: 2, children: 0 },
        { weekIndex: 3, familyIndex: 1, adults: 2, children: 2 },
        { weekIndex: 3, familyIndex: 2, adults: 2, children: 0 },
        { weekIndex: 3, familyIndex: 3, adults: 2, children: 2 },
        // Week 5 (this week) - some RSVPs already
        { weekIndex: 4, familyIndex: 0, adults: 2, children: 0, notes: 'Bringing dessert!' },
        { weekIndex: 4, familyIndex: 1, adults: 2, children: 2 },
        { weekIndex: 4, familyIndex: 3, adults: 2, children: 2, notes: 'Running 10 mins late' },
        // Week 6 (next week) - early RSVPs
        { weekIndex: 5, familyIndex: 0, adults: 2, children: 0 },
        { weekIndex: 5, familyIndex: 2, adults: 2, children: 0 },
      ];

      for (const rsvpInfo of rsvpData) {
        if (romansWeekIds[rsvpInfo.weekIndex] && createdFamilies[rsvpInfo.familyIndex]) {
          const weekId = romansWeekIds[rsvpInfo.weekIndex];
          const family = createdFamilies[rsvpInfo.familyIndex];

          try {
            const existingRsvp = await rsvps.getByFamilyAndWeek(family.id, weekId);
            if (!existingRsvp) {
              await rsvps.create({
                weekId,
                familyId: family.id,
                familyName: family.name,
                adultCount: rsvpInfo.adults,
                childCount: rsvpInfo.children,
                notes: rsvpInfo.notes,
              });
              results.rsvps.push(`${family.name} → Week ${rsvpInfo.weekIndex + 1}`);
            }
          } catch (error) {
            console.error(`Error creating RSVP:`, error);
          }
        }
      }
    }

    // 6. Create sample meals for some weeks
    if (romansWeekIds.length >= 6 && createdFamilies.length >= 4) {
      const mealData = [
        { weekIndex: 3, familyIndex: 1, description: 'Lasagna, garlic bread, and Caesar salad' },
        {
          weekIndex: 4,
          familyIndex: 3,
          description: 'Taco bar with all the fixings - beef and chicken!',
        },
        {
          weekIndex: 5,
          familyIndex: 2,
          description: 'BBQ pulled pork sandwiches, coleslaw, and baked beans',
        },
      ];

      for (const mealInfo of mealData) {
        if (romansWeekIds[mealInfo.weekIndex] && createdFamilies[mealInfo.familyIndex]) {
          const weekId = romansWeekIds[mealInfo.weekIndex];
          const family = createdFamilies[mealInfo.familyIndex];

          try {
            const existingMeal = await meals.getByWeek(weekId);
            if (!existingMeal) {
              await meals.create({
                weekId,
                familyId: family.id,
                familyName: family.name,
                description: mealInfo.description,
              });
              results.meals.push(`${family.name} bringing meal for Week ${mealInfo.weekIndex + 1}`);
            }
          } catch (error) {
            console.error(`Error creating meal:`, error);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with rich sample data',
      results,
      familyCodes: SAMPLE_FAMILIES.map((f) => ({
        name: f.name,
        code: f.code,
        isAdmin: f.isAdmin,
      })),
      tips: [
        'Use INGERSOLL2024 to login as admin',
        'Use SMITH2024, JOHNSON2024, GARCIA2024, or WILLIAMS2024 for regular users',
        'Current week should be Week 5 (Peace with God)',
        'Past weeks 1-4 have history, future weeks 6-10 are upcoming',
      ],
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
