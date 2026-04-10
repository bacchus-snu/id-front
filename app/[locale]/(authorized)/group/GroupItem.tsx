'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Group } from '@/api';
import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

enum MembershipState {
  None = 'none',
  Pending = 'pending',
  Joined = 'joined',
}

function membershipStateFromGroup(group: Group): MembershipState {
  if (group.joined) {
    return MembershipState.Joined;
  } else if (group.pending) {
    return MembershipState.Pending;
  } else {
    return MembershipState.None;
  }
}

type Props = {
  group: Group;
};
export default function GroupItem(props: Props) {
  const router = useRouter();

  const { group } = props;
  const { dict } = useLocaleDict();
  const groupsDict = dict.groups;
  const showToast = useToast();

  const [membershipState, setMembershipState] = useState(membershipStateFromGroup(group));
  const [modifyInProgress, setModifyInProgress] = useState(false);

  async function handleClickApply() {
    try {
      setModifyInProgress(true);
      setMembershipState(MembershipState.Pending);
      const resp = await fetch(`/group/${group.idx}/membership`, {
        method: 'post',
        body: JSON.stringify({ action: 'add', self: true }),
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
        },
      });

      if (!resp.ok) {
        const body = await resp.json();
        const message = body?.message;
        if (message) {
          showToast({
            type: 'error',
            message,
          });
        }
        setMembershipState(MembershipState.None);
        return;
      }
    } catch (e) {
      showToast({
        type: 'error',
        message: String(e),
      });
    } finally {
      setModifyInProgress(false);
    }

    router.refresh();
  }

  async function handleClickLeave() {
    try {
      setModifyInProgress(true);
      setMembershipState(MembershipState.None);
      const resp = await fetch(`/group/${group.idx}/membership`, {
        method: 'post',
        body: JSON.stringify({ action: 'remove', self: true }),
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
        },
      });

      if (!resp.ok) {
        const body = await resp.json();
        const message = body?.message;
        if (message) {
          showToast({
            type: 'error',
            message,
          });
        }
        setMembershipState(MembershipState.Joined);
        return;
      }
    } catch (e) {
      showToast({
        type: 'error',
        message: String(e),
      });
    } finally {
      setModifyInProgress(false);
    }
  }

  let joinState = null;
  let joinButton = null;
  switch (membershipState) {
    case MembershipState.None:
      joinButton = (
        <Button className="flex-0 w-24" disabled={modifyInProgress} onClick={handleClickApply}>
          {groupsDict.buttonApply}
        </Button>
      );
      break;
    case MembershipState.Pending:
      joinState = <div className="text-dimmed">{groupsDict.statePending}</div>;
      joinButton = <Button className="flex-0 w-24" disabled>{groupsDict.buttonApplyPending}
      </Button>;
      break;
    case MembershipState.Joined:
      joinState = <div className="text-dimmed">{groupsDict.stateJoined}</div>;
      joinButton = (
        <Button
          className="flex-0 w-24"
          color="accent"
          disabled={modifyInProgress}
          onClick={handleClickLeave}
        >
          {groupsDict.buttonLeave}
        </Button>
      );
      break;
  }

  return (
    <div className="border rounded p-2">
      <div className="flex flex-row items-baseline justify-between">
        <h3 className="text-h3">{group.name}</h3>
        {joinState}
      </div>
      <p className="text-dimmed">
        {group.description}
      </p>
      <div className="flex flex-row-reverse gap-2 mt-2">
        {joinButton}
        {group.owner && (
          <Link className="flex-0 w-24" href={`/group/${group.idx}/members`}>
            <Button className="w-full">{groupsDict.buttonManage}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
