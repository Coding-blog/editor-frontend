import cloneDeep from 'lodash.clonedeep';
import { createReader, deleteReader, getIssuesByReader, getSuggestedTags, Reader, updateReader } from '@api/editor-backend';
import { RendererLike } from 'render-jsx';
import { Conditional } from 'callbag-jsx';
import { state } from 'callbag-state';

import { Header } from '../misc/header';
import { changed, isEmail, isMinLength, isRequired, valid, snapshot } from '../util/forms';
import { expr, fromPromise, of } from 'callbag-common';
import { TagInput } from '../misc/tag-input';
import { authToken } from '../auth/service';
import { Buttons } from '../misc/buttons';
import { IconButton } from '../misc/icon-button';
import { noop } from '../util/noop';
import { Wait } from '../misc/wait';
import { IssuesList } from '../issues/list';
import { navigate } from '../nav/service';


export interface SingleProps {
  reader?: Reader;
  ondelete?: () => void;
}


export function Single(props: SingleProps, renderer: RendererLike<Node>) {
  const reader = state<Reader>(cloneDeep(props.reader) || {
    name: '',
    email: '',
    interests: [],
  });

  const saving = state(false);

  const isValid = valid(reader, {
    name: [isRequired, isMinLength(5)],
    email: [isRequired, isEmail],
    interests: [isRequired, isMinLength(2)],
  });
  const hasChanged = changed(reader, () => props.reader, saving);
  const existing = expr($ => ($(saving) && false) || !!props.reader);

  const save = () => {
    saving.set(true);
    (props.reader?updateReader:createReader)(authToken()!, reader.get()!)
      .then(() => props.reader = snapshot(reader))
      .catch(() => alert('Could not save!'))
      .finally(() => saving.set(false));
  };

  const trash = () => {
    saving.set(true);
    deleteReader(authToken()!, reader.get())
      .then(() => props.ondelete ? props.ondelete() : noop)
      .catch(() => alert('Could not delete!'))
      .finally(() => saving.set(false));
  };

  return <>
    <Header>{expr($ => $(existing) ? 'Reader' : 'New Reader')}</Header>

    <label>Email</label>
    <input type='text' _state={reader.sub('email')} placeholder="Ensure this is a proper email address."/>

    <label>Name</label>
    <input type='text' _state={reader.sub('name')}
      placeholder="Name will be used for searching and must be at least 5 characters."/>

    <label>Interests</label>
    <TagInput _state={reader.sub('interests')}
      placeholder="Pick some interests ..."
      suggestions={text => fromPromise(getSuggestedTags(authToken()!, text))}
    />

    <hr/>

    <Buttons>
      <Conditional if={existing} then={() =>
        <>
          <button onclick={() => navigate('issues/new', {
            query: {
              for: props.reader!.email
            }
          })}>New Issue</button>
          <IconButton icon='./assets/icon-trash.svg' onclick={trash}/>
        </>
      }/>
      <button disabled={expr($ => !($(isValid) && $(hasChanged) && !$(saving)))} onclick={save}>
        {
          expr($ => $(saving) ?
            ($(existing) ? 'Updating ...' : 'Saving ...') :
            ($(existing) ? 'Update' : 'Save'))
        }
      </button>
    </Buttons>

    <hr/>

    {
      props.reader
        ? <Wait for={getIssuesByReader(authToken()!, props.reader.email)}
          with={() => <>Loading issuess ...</>}
          then={issues =>
            <IssuesList issues={of(issues)}
              pick={issue =>
                navigate('issues/:reader/:title/edit', {
                  route: {
                    reader: props.reader!.email,
                    title: issue.title
                  }
                })
              }
            />
          }/>
        : ''
    }
  </>;
}
